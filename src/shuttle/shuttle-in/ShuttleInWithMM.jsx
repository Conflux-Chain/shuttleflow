import React, { useCallback, useState, useEffect } from 'react'
/**
 * library
 */
import { useTranslation, Trans } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import { string, object } from 'yup'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import Big from 'big.js'
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { Logger } from '@ethersproject/logger'
import { useMessages } from '@cfxjs/react-ui'
import { Info } from '@zeit-ui/react-icons'

/**
 * component
 */
import clear from '../../component/clear.svg'
import Modal, { modalStyles } from '../../component/Modal'
import ShuttleHistory from '../../history/ShuttleHistory'
import TokenInput from '../../component/TokenInput/TokenInput'
import Button from '../../component/Button/Button'
import ShuttleOutInput from '../ShuttleoutInput'
import { giveTransactionResult } from '../../globalPopup/TranscationResult'

/**
 * hooks
 */
import useStyle from '../../component/useStyle'

/**
 * css
 */

import commonInputStyles from '../../component/input.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'
import shuttleOutStyles from './../shuttle-out/ShuttleOut.module.scss'
import rootLayoutStyles from './../../../src/layout/Layout.module.scss'
/**
 * image
 */
import down from '../down.svg'
import tick from './tick.svg'
import notAllowImg from './../../../src/layout/not-allow.png'

/**
 * constant
 */
import {
  IS_DEV,
  ZERO_ADDR_HEX,
  CHAINID,
  MetaMask_WEBSITE,
} from '../../config/config'

/**
 * internal library
 */
import { big } from '../../lib/yup/BigNumberSchema'
import {
  calculateBalance,
  calculateGasMargin,
  maxAmountSpend,
} from './../../util'
import { checkCfxAddressWithNet } from './../../util/address'
import {
  getTokenContract,
  getDepositRelayerContract,
  getDepositRelayerAddressChain,
} from './../../util/contract'
import { injected } from '../../connectors'
const ButtonType = Object.freeze({
  CONNECT_METAMASK: 'connect_metamask',
  APPROVE: 'approve',
  SHUTTLEIN: 'shuttlein',
})
export default function ShuttleIn({ tokenInfo, notEnoughGas, gasLow }) {
  const { decimals, originSymbol, originAddr, origin } = tokenInfo
  const [
    commonCx,
    shuttleCx,
    shuttleInCx,
    shuttleOutCx,
    modalCx,
    rootCx,
  ] = useStyle(
    commonInputStyles,
    shuttleStyle,
    shuttleInStyles,
    shuttleOutStyles,
    modalStyles,
    rootLayoutStyles
  )
  const {
    active,
    account,
    connector,
    activate,
    error,
    chainId,
    library,
  } = useWeb3React()
  const { t } = useTranslation([
    'shuttle-out',
    'shuttle-in',
    'shuttle',
    'common',
  ])
  const [addressPopup, setAddressPopup] = useState(false)
  const [minPopup, setMinPopup] = useState(false)
  const [copyPopup, setCopyPopup] = useState(false)
  const [operationPending, setOperationPending] = useState(false)
  const [btnI18nKey, setBtnI18nKey] = useState('shuttle-in')
  const [balance, setBalance] = useState(Big(0))
  const [btnType, setBtnType] = useState('')
  const [isNetworkBlock, setIsNetworkBlock] = useState(false)
  const [, setMessage] = useMessages()
  //ETH OR BNB
  const isNativeToken = ['ETH', 'BNB'].indexOf(originSymbol) !== -1
  const ORIGIN_ETH = 'eth'
  const ORIGIN_BSC = 'bsc'
  const dRcontract = getDepositRelayerContract(
    origin === 'eth' ? 'eth' : 'bsc',
    library,
    account
  )
  let tokenContract = {}
  if (!isNativeToken) {
    tokenContract = getTokenContract(originAddr, library, account)
  }
  useEffect(() => {
    if (active) {
      setIsNetworkBlock(getIsNetworkBlock(origin, chainId))
    } else {
      setIsNetworkBlock(false)
    }
  }, [active, chainId])
  useEffect(() => {
    if (!active) {
      setBtnType(ButtonType.CONNECT_METAMASK)
    } else {
      setBtnType(ButtonType.SHUTTLEIN)
    }
  }, [active])
  useEffect(() => {
    switch (btnType) {
      case ButtonType.CONNECT_METAMASK:
        setBtnI18nKey('connect-Metamask')
        break
      case ButtonType.APPROVE:
        setBtnI18nKey('approve')
        break
      case ButtonType.SHUTTLEIN:
        setBtnI18nKey('shuttle-in')
        break
    }
  }, [btnType])

  /**
   * ERC20 token on Ethereum or BEP20 token on BSC
   */
  useEffect(() => {
    const shouldFetch = account && tokenInfo && !isNativeToken
    async function fetchData() {
      const val = await getValFromTokenContract('balanceOf', [account])
      setBalance(calculateBalance(val, decimals))
    }
    shouldFetch && fetchData()
    let interval
    if (shouldFetch) {
      interval = setInterval(() => {
        fetchData()
      }, 2000)
    }
    if (!account) {
      interval && clearInterval(interval)
    }
    return () => {
      interval && clearInterval(interval)
    }
  }, [tokenInfo, account, isNativeToken])
  /**
   * ETH OR BNB
   */
  useEffect(() => {
    const shouldFetch = account && isNativeToken
    async function fetchData() {
      const val = await getNativeBalance(account)
      setBalance(val)
    }
    shouldFetch && fetchData()
    let interval
    if (shouldFetch) {
      interval = setInterval(() => {
        fetchData()
      }, 2000)
    }
    if (!account) {
      interval && clearInterval(interval)
    }
    return () => {
      interval && clearInterval(interval)
    }
  }, [tokenInfo, account, isNativeToken])
  const displayCopy = useCallback(() => {
    setCopyPopup(true)
    const tm = setTimeout(() => setCopyPopup(false), 2000)
    return () => {
      clearTimeout(tm)
    }
  }, [])
  const schema = object().shape({
    amount: big().gt(0, 'min-error').max(balance, 'error.insufficient'),
    address: string()
      .required('error.required')
      .test('address-valid', 'error.invalid-address', (address) =>
        checkCfxAddressWithNet(address)
      ),
  })

  /**
   * get ETH/BNB balance from remote
   * @param {} address
   * @returns
   */
  async function getNativeBalance(address) {
    if (!library) return 0
    const balance = await library.getBalance(address)
    return calculateBalance(balance, decimals)
  }

  async function getValFromTokenContract(methodName, params) {
    const contract = getTokenContract(originAddr, library, account)
    const val = await contract[methodName](...params)
    return val
  }

  function tryActivation() {
    activate(injected, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected) // a little janky...can't use setError because the connector isn't set
      }
      if (error && error.code === -32002) {
        setMessage({
          icon: <Info />,
          text: t('tip-metamask-operate'),
          color: 'warning',
        })
      }
    })
  }

  function getIsNetworkBlock(chain, chainId) {
    let showBlock = false
    if (!chain || !chainId) return false
    if (chain === ORIGIN_ETH) {
      IS_DEV && (showBlock = chainId != CHAINID.ETHEREUM_RINKEBY)
      !IS_DEV && (showBlock = chainId != CHAINID.ETHEREUM_MAINNET)
    }
    if (chain === ORIGIN_BSC) {
      IS_DEV && (showBlock = chainId != CHAINID.BSC_TESTNET)
      !IS_DEV && (showBlock = chainId != CHAINID.BSC_MAINNEET)
    }
    return showBlock
  }

  const {
    register,
    watch,
    handleSubmit,
    getValues,
    setValue,
    errors,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  })
  function contractApprove(tokenContract, value, gas) {
    tokenContract
      .approve(getDepositRelayerAddressChain(origin), value, {
        gasLimit: gas ? calculateGasMargin(gas) : undefined,
      })
      .then((txResponse) => {
        txResponse &&
          txResponse
            .wait()
            .then((data) => {
              setOperationPending(false)
              setBtnType(ButtonType.SHUTTLEIN)
            })
            .catch((error) => {
              setOperationPending(false)
            })
      })
      .catch((error) => {
        setOperationPending(false)
      })
  }
  const onSubmit = async (data) => {
    if (!active) {
      if (!window.ethereum) {
        window.open(MetaMask_WEBSITE, '_blank')
        return
      }
      //if the user have not connnected MetaMask
      tryActivation()
    } else {
      if (operationPending) {
        return
      }
      const { amount, address } = data
      if (isNativeToken) {
        setOperationPending(true)
        let params = [
          format.hexAddress(address),
          ZERO_ADDR_HEX,
          {
            value: BigNumber.from(amount.times(`1e${decimals}`).toString()),
          },
        ]
        let gas = await dRcontract.estimateGas.deposit(
          params[0],
          params[1],
          params[2]
        )
        giveTransactionResult(
          dRcontract
            .deposit(params[0], params[1], {
              ...params[2],
              gasLimit: calculateGasMargin(gas),
            })
            .then((data) => data.hash),
          { chain: origin, done: () => setOperationPending(false) }
        )
      } else {
        switch (btnType) {
          case ButtonType.APPROVE:
            setOperationPending(true)
            tokenContract.estimateGas
              .approve(getDepositRelayerAddressChain(origin), MaxUint256)
              .then((gas) => {
                contractApprove(tokenContract, MaxUint256, gas)
              })
              .catch((error) => {
                if (
                  error.code === Logger.errors.UNPREDICTABLE_GAS_LIMIT ||
                  (error.data && error.data.code === -32000)
                ) {
                  contractApprove(tokenContract, 0)
                } else {
                  setOperationPending(false)
                }
              })
            break
          case ButtonType.SHUTTLEIN:
            const allowance = await getValFromTokenContract('allowance', [
              account,
              getDepositRelayerAddressChain(origin),
            ])
            if (
              new Big(allowance.toString()).lt(amount.times(`1e${decimals}`))
            ) {
              setBtnType(ButtonType.APPROVE)
              return
            }
            let params = [
              originAddr,
              format.hexAddress(address),
              ZERO_ADDR_HEX,
              BigNumber.from(amount.times(`1e${decimals}`).toString()),
              {
                value: BigNumber.from(0),
              },
            ]
            let gasDt = await dRcontract.estimateGas.depositToken(
              params[0],
              params[1],
              params[2],
              params[3],
              params[4]
            )
            giveTransactionResult(
              dRcontract
                .depositToken(params[0], params[1], params[2], params[3], {
                  ...params[4],
                  gasLimit: calculateGasMargin(gasDt),
                })
                .then((data) => data.hash),
              { chain: origin, done: () => setOperationPending(false) }
            )

            break
        }
      }
    }
  }
  const btnClick = () => {
    if (!window.ethereum) {
      window.open(MetaMask_WEBSITE, '_blank')
      return
    }
    //if the user have not connnected MetaMask
    tryActivation()
  }
  const ContainerContent = (
    <>
      <TokenInput
        tokenInfo={tokenInfo}
        dir="from"
        placeholder={t('placeholder.out')}
        displayCopy={displayCopy}
      />
      <div className={shuttleCx('down')}>
        <img alt="down" src={down}></img>
      </div>
      <TokenInput
        dir="to"
        tokenInfo={tokenInfo}
        placeholder={t('placeholder.in')}
        displayCopy={displayCopy}
        cToken
      />
      {tokenInfo && !notEnoughGas && (
        <>
          <label className={shuttleOutCx('amount-container')}>
            <div>
              <span className={shuttleCx('title')}>
                {t('shuttlein-amount')}{' '}
              </span>
            </div>

            <div className={shuttleOutCx('amount-input')}>
              <ShuttleOutInput
                showPlaceholder={watch('amount')}
                name="amount"
                ref={register}
                decimals={tokenInfo && tokenInfo.decimals}
                error={errors.amount}
                placeholder={
                  !tokenInfo
                    ? t('placeholder.input-amount')
                    : t('balance', {
                        amount: balance,
                        symbol: originSymbol,
                      })
                }
              />
              <div
                onClick={() => {
                  setValue(
                    'amount',
                    isNativeToken ? maxAmountSpend(balance, origin) : balance
                  )
                }}
                className={shuttleOutCx('all') + ' ' + shuttleCx('small-text')}
              >
                {t('all')}
              </div>
            </div>
          </label>

          <div className={shuttleCx('small-text')}>
            <span> {t('minimum-amount-unlimited')}</span>
            <span>{t('no-fee')}</span>
          </div>

          <div>
            <ErrorMessage
              errors={errors}
              name="amount"
              render={({ message }) => {
                return (
                  <span
                    className={shuttleCx('small-text')}
                    style={{ color: '#F3504F' }}
                  >
                    {t(message, tokenInfo)}
                  </span>
                )
              }}
            />
          </div>
          {gasLow}
          {/* shuttle out address */}
          <div className={shuttleOutCx('address-container')}>
            <div>
              <span className={shuttleCx('title')}>
                {t('receiving-address')}{' '}
              </span>
            </div>
            <div className={shuttleOutCx('address-input')}>
              <ShuttleOutInput
                showPlaceholder={watch('address')}
                style={{ fontSize: '1.1rem', paddingRight: '5rem' }}
                ref={register}
                name="address"
                error={errors.address}
                placeholder={
                  <Trans
                    values={{
                      type: t('cfx'),
                    }}
                    i18nKey={`placeholder.address-evm`}
                    t={t}
                  ></Trans>
                }
              />
              <img
                style={{
                  display: !!getValues().address ? 'block' : 'none',
                }}
                onClick={() => {
                  setValue('address', '')
                }}
                src={clear}
                alt="clear"
                className={commonCx('clear')}
              ></img>
            </div>
          </div>

          <ErrorMessage
            errors={errors}
            name="address"
            render={({ message }) => {
              return (
                <p
                  style={{ color: '#F3504F' }}
                  className={shuttleCx('small-text')}
                >
                  {t(message)}
                </p>
              )
            }}
          />
          {origin === 'cfx' && <Warning>{t('no-contract')}</Warning>}

          {active ? (
            <Button
              loading={operationPending}
              disabled={!tokenInfo}
              type="submit"
              className={shuttleOutCx('btn')}
            >
              {t(btnI18nKey)}
            </Button>
          ) : (
            <Button
              loading={operationPending}
              disabled={!tokenInfo}
              type="button"
              className={shuttleOutCx('btn')}
              onClick={btnClick}
            >
              {t(btnI18nKey)}
            </Button>
          )}
        </>
      )}
    </>
  )
  return (
    <div className={shuttleCx('root')}>
      {active ? (
        <FormContainer onSubmitCallback={handleSubmit(onSubmit)}>
          {ContainerContent}
        </FormContainer>
      ) : (
        <CommonContainer>{ContainerContent}</CommonContainer>
      )}
      <ShuttleHistory type="in" />
      <Modal
        show={addressPopup}
        title
        onClose={() => setAddressPopup(false)}
        clickAway={() => setAddressPopup(false)}
      >
        <div className={modalCx('content')}>{t('popup.address')}</div>
        <div className={modalCx('btn')} onClick={() => setAddressPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal
        show={minPopup}
        title
        onClose={() => setMinPopup(false)}
        clickAway={() => setMinPopup(false)}
      >
        <div className={modalCx('content')}>{t('popup.min')}</div>
        <div className={modalCx('btn')} onClick={() => setMinPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal
        show={copyPopup}
        clickAway={() => {
          setCopyPopup(false)
        }}
      >
        <div className={shuttleInCx('copy-popup')}>
          <img alt="tick" src={tick}></img>
          <div>{t('popup.copy')}</div>
        </div>
      </Modal>
      <Modal show={isNetworkBlock}>
        <div className={rootCx('not-allow')}>
          <img src={notAllowImg} alt={notAllowImg}></img>
          <div className={rootCx('title')}>{t('error.block')}</div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              // whiteSpace: 'nowrap',
            }}
          >
            {t('error.unsupported-network-mm') +
              '' +
              t(
                `${origin === 'eth' ? 'ethereum' : 'bsc'}` +
                  '-' +
                  `${!IS_DEV ? 'mainnet' : 'testnet'}`
              )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

function FormContainer({ children, onSubmitCallback }) {
  return (
    <form onSubmit={onSubmitCallback} autoComplete="chrome-off">
      {children}
    </form>
  )
}
function CommonContainer({ children }) {
  return <>{children}</>
}
