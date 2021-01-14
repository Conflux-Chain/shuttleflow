import React, { useState, useRef, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useBalance } from '../../data/useBalance'

import inputStyles from '../../component/input.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleOutStyles from './ShuttleOut.module.scss'
import Modal, { modalStyles } from '../../component/Modal'
import CTokenPopup from '../CTokenPopup'
import tick from '../shuttle-in/tick.svg'

import useStyle from '../../component/useStyle'
import Button from '../../component/Button/Button'
import clear from '../../component/clear.svg'
import down from '../down.svg'
import fail from './fail.svg'
import sent from './sent.svg'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { string, object } from 'yup'
import { ErrorMessage } from '@hookform/error-message'

import { buildSearch } from '../../component/urlSearch'
import shuttleInStyle from '../shuttle-in/ShuttleIn.module.scss'

import ShuttleHistory from '../../history/ShuttleHistory'
import TokenInput from '../TokenInput'
import ShuttleOutInput from '../Input'
import { parseNum } from '../../util/formatNum'
import { CONFLUXSCAN_TX, CUSTODIAN_CONTRACT_ADDR } from '../../config/config'
import WithQuestion from '../../component/WithQuestion'
import checkAddress from '../../data/checkAddress'
import Check from '../../component/Check/Check'
import useCToken from '@cfxjs/react-hooks/lib/useCToken'
import { big } from '../../lib/yup/BigNumberSchema'

// dec5 usdt
export default function ShuttleOut({ tokenInfo }) {
  const [commonCx, modalCx, shuttleCx, shuttleOutCx, shuttleInCx] = useStyle(
    inputStyles,
    modalStyles,
    shuttleStyle,
    shuttleOutStyles,
    shuttleInStyle
  )
  const { t } = useTranslation('shuttle-out')
  const extra = {}
  const token = tokenInfo && tokenInfo.reference

  const [errorPopup, setErrorPopup] = useState(false)
  const [successPopup, setSuccessPopup] = useState(false)
  const [addrPopup, setAddrPopup] = useState(false)
  const [feePopup, setFeePopup] = useState(false)
  const [ctokenPopup, setCTokenPopup] = useState(false)
  const [copyPopup, setCopyPopup] = useState(false)

  const blockCallback = useRef(null)
  const [comfirmTxt, setComfirmTxt] = useState('')

  function blockShuttleout(cb, txt) {
    blockCallback.current = cb
    setComfirmTxt(txt)
  }

  const displayCopy = useCallback(() => {
    setCopyPopup(true)
    const tm = setTimeout(() => setCopyPopup(false), 2000)
    return () => {
      clearTimeout(tm)
    }
  }, [])

  const isAll = useRef(false)

  const { burn } = useCToken(
    tokenInfo ? tokenInfo.ctoken : '',
    CUSTODIAN_CONTRACT_ADDR
  )

  const _balance = useBalance(tokenInfo && tokenInfo.ctoken)
  let balance = 0

  if (_balance) {
    //balanace is 18 decimal point, it is fixed rather
    //than configurable
    balance = parseNum(_balance, 18)
  }

  //to do fake a balance
  const schema = object().shape({
    outamount: big()
      .min(tokenInfo ? tokenInfo.minimal_burn_value : 0, 'error.min')
      .max(balance, 'error.insufficient'),
    //outaddress maybe a better name, it will trigger Chrome autofill
    outwallet: string()
      .required('error.required')
      .matches(/^0x[0-9a-fA-F]{40}$/, 'error.invalid-address'),
  })

  const {
    register,
    watch,
    handleSubmit,
    getValues,
    setValue,
    errors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: extra,
    mode: 'onBlur',
  })
  //not necessarily trigger render
  const tx = useRef('')
  const onSubmit = (data) => {
    let { outwallet, outamount } = data
    console.log(data)
    // return
    checkAddress(outwallet).then((x) => {
      new Promise((resolve) => {
        if (x === 'eth') {
          resolve('yes')
        } else {
          blockShuttleout(resolve, t(`confirm.${x}`))
        }
      }).then((result) => {
        if (result === 'yes') {
          if (isAll.current) {
            outamount = balance
          }
          burn(outamount, outwallet)
            .then((e) => {
              tx.current = e
              setSuccessPopup(true)
            })
            .catch((e) => {
              setErrorPopup(true)
            })
        }
      })
    })
  }

  if (token && !tokenInfo) {
    return null //the token info is loading
  }

  return (
    <div className={shuttleCx('root')}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="chrome-off">
        {/* token */}
        <TokenInput
          placeholder={t('placeholder.out')}
          to={{
            pathname: '/token',
            search: buildSearch({
              next: 'shuttle/out',
              cToken: 1,
            }),
          }}
          tokenInfo={tokenInfo}
          cToken={() => setCTokenPopup(true)}
        />

        <div className={shuttleCx('down')}>
          <img alt="down" src={down}></img>
        </div>

        {/* conflux token */}
        <TokenInput
          to={{
            pathname: '/token',
            search: buildSearch({
              next: '/shuttle/out',
            }),
          }}
          tokenInfo={tokenInfo}
          placeholder={t('placeholder.in')}
        />

        {/* shuttle out amount */}
        <label className={shuttleOutCx('amount-container')}>
          <div>
            <span className={shuttleCx('title')}>{t('amount')} </span>
          </div>

          <div className={shuttleOutCx('amount-input')}>
            <ShuttleOutInput
              showPlaceholder={watch('outamount')}
              name="outamount"
              ref={register}
              decimals={tokenInfo && tokenInfo.decimals}
              error={errors.outamount}
              placeholder={
                !tokenInfo
                  ? t('placeholder.input-amount')
                  : t('balance', {
                      amount: balance,
                      symbol: tokenInfo.symbol,
                    })
              }
            />
            <div
              onClick={() => {
                isAll.current = true
                setValue('outamount', balance)
              }}
              className={shuttleOutCx('all') + ' ' + shuttleCx('small-text')}
            >
              {t('all')}
            </div>
          </div>
        </label>

        {tokenInfo && (
          <div className={shuttleCx('small-text')}>
            <span> {t('min-amount', tokenInfo)}</span>
            <WithQuestion onClick={() => setFeePopup(true)}>
              <span>{t('fee', tokenInfo)}</span>
            </WithQuestion>
          </div>
        )}

        <div>
          <ErrorMessage
            errors={errors}
            name="outamount"
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

        {/* shuttle out address */}
        <div className={shuttleOutCx('address-container')}>
          <WithQuestion
            className={shuttleCx('title')}
            onClick={(e) => {
              setAddrPopup(true)
            }}
          >
            <span>{t('address')}</span>
          </WithQuestion>
          <div className={shuttleOutCx('address-input')}>
            <ShuttleOutInput
              showPlaceholder={watch('outwallet')}
              style={{ fontSize: '1.1rem' }}
              ref={register}
              name="outwallet"
              error={errors.outwallet}
              placeholder={
                <Trans
                  values={{
                    type: token
                      ? token === 'btc'
                        ? t('btc')
                        : t('eth')
                      : t('btc') + '/' + t('eth'),
                  }}
                  i18nKey={'placeholder.address'}
                  t={t}
                ></Trans>
              }
            />
            <img
              style={{ display: !!getValues().outwallet ? 'block' : 'none' }}
              onClick={() => {
                setValue('outwallet', '')
              }}
              src={clear}
              alt="clear"
              className={commonCx('clear')}
            ></img>
          </div>
        </div>

        <ErrorMessage
          errors={errors}
          name="outwallet"
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

        <Button
          disabled={!tokenInfo}
          type="submit"
          className={shuttleOutCx('btn')}
        >
          {t('shuttle-out')}
        </Button>
      </form>
      <ShuttleHistory type="burn" />
      <Modal
        show={errorPopup}
        onClose={() => setErrorPopup(false)}
        clickAway={() => setErrorPopup(false)}
      >
        <img alt="img" className={shuttleOutCx('img')} src={fail}></img>
        <div className={modalCx('strong')}>{t('popup.fail')}</div>
        <div className={modalCx('btn')} onClick={() => setErrorPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal
        show={successPopup}
        onClose={() => setSuccessPopup(false)}
        clickAway={() => setSuccessPopup(false)}
      >
        <img alt="img" className={shuttleOutCx('img')} src={sent}></img>
        <div className={modalCx('strong')}>{t('popup.sent')}</div>
        <div
          className={modalCx('btn')}
          onClick={() => {
            setSuccessPopup(false)
            setValue('outamount', 0)
            window.open(CONFLUXSCAN_TX + tx.current, '_blank')
          }}
        >
          {t('popup.details')}
        </div>
      </Modal>
      <Modal
        title
        show={addrPopup}
        onClose={() => setAddrPopup(false)}
        clickAway={() => setAddrPopup(false)}
      >
        <div className={modalCx('content')}>{t('popup.address')}</div>
        <div className={modalCx('btn')} onClick={() => setAddrPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal
        show={feePopup}
        title
        onClose={() => setFeePopup(false)}
        clickAway={() => setFeePopup(false)}
      >
        <div className={modalCx('content')}>
          <Trans values={tokenInfo} i18nKey="popup.fee" t={t}></Trans>
        </div>
        <div className={modalCx('btn')} onClick={() => setFeePopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <CTokenPopup
        cTokenPopup={ctokenPopup}
        setCTokenPopup={setCTokenPopup}
        tokenInfo={tokenInfo}
        displayCopy={displayCopy}
      />
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
      <ComfirmPopup
        confluxComfirmPopup={comfirmTxt}
        blockCallback={blockCallback}
        confirm={() => {
          blockCallback.current('yes')
          blockCallback.current = null
          setComfirmTxt(false)
        }}
        close={() => setComfirmTxt(false)}
        t={t}
        modalCx={modalCx}
        shuttleOutCx={shuttleOutCx}
      />
    </div>
  )
}

function ComfirmPopup({
  confluxComfirmPopup,
  modalCx,
  shuttleOutCx,
  confirm,
  close,
  t,
}) {
  const [checked, setChecked] = useState(false)
  return (
    <Modal show={confluxComfirmPopup} onClose={close} title={t('confirm.btn')}>
      <div className={modalCx('content')}>{confluxComfirmPopup} </div>

      <div className={shuttleOutCx('check')}>
        <Check
          checked={checked}
          txt={t('confirm.check')}
          setChecked={setChecked}
          solid
        />
      </div>

      <Button
        disabled={!checked}
        onClick={confirm}
        className={modalCx('btn') + ' ' + shuttleOutCx('comfirm-btn')}
      >
        {t('confirm.btn')}
      </Button>
    </Modal>
  )
}
