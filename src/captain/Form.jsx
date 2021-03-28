import React, { useEffect, useState } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from '../component/input.module.scss'
import formStyles from './Form.module.scss'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { object } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Header from './FormHeader'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import Toggle from '../component/Toggle/Toggle'
import createInput from './createInput'
import getFields from './fields'
import Modal from '../component/Modal'
import close from './close.svg'
import warning from './warning.svg'

import ApproveIcon from './ApproveIcon'

import Button from '../component/Button/Button'
import styled from 'styled-components'
import { isZeroAddress } from '../util/address'
import { CONTRACT_CONFIG, getContract } from '../data/contract/contract'
import CHAIN_CONFIG from '../config/chainConfig'
import { useParams } from 'react-router'
import useTokenList from '../data/useTokenList'

export default function CaptainForm({
  origin,
  pendingCount,
  countdown,
  address,
  icon,
  beCaptain,
  cethBalanceBig,
  out_fee,
  in_fee,
  minimal_out_value,
  minimal_in_value,
  reference_symbol,
  reference_name,
  in_token_list,
  symbol,
  wallet_fee,
  supported,
  sponsor,
  decimals,
  minMortgageBig,
  currentMortgageBig,
  cethBalanceDisplay,
  safeSponsorAmount,
  default_cooldown_minutes,
}) {
  //the data from tokenList is not accurate due to the delay
  //we can tell based on the contract instead
  supported = supported || !isZeroAddress(sponsor)
  const { chain } = useParams()

  const shouldDisplayApprove = origin === 'cfx'

  const { t } = useTranslation(['captain'])
  const [inputCx, formCx] = useStyle(inputStyles, formStyles)
  const [mortgagePopup, setMortgagePopup] = useState(false)
  const [readonlyPopup, setReadonlyPopup] = useState(false)
  const [transactionPending, setTranscationPending] = useState(false)

  function clickLabel() {
    setMortgagePopup(true)
  }
  const isMe = address === sponsor
  const isMortgageLow = safeSponsorAmount.gt(currentMortgageBig)
  const isLoacking = countdown > 0

  const [showMortgage, setShowMortgage] = useState(!isMe)

  const onSubmit = (data) => {
    setTranscationPending(true)
    beCaptain({
      amount: data.mortgage_amount,
      burnFee: data.burn_fee,
      mintFee: data.mint_fee,
      walletFee: data.wallet_fee,
      minimalMintValue: data.minimal_mint_value,
      minimalBurnValue: data.minimal_burn_value,
      cb: () => {
        setTranscationPending(false)
      },
    })
  }
  const fields = getFields({
    t,
    reference_symbol,
    symbol,
    out_fee,
    in_fee,
    minimal_out_value,
    minimal_in_value,
    isLoacking,
    decimals,
    wallet_fee,
    showMortgage,
    cethBalanceBig,
    minMortgageBig,
    isMe,
    isMortgageLow,
  })

  const { defaultValues, schema } = fields.reduce(
    (pre, { name, defaultValue, validate }) => {
      if (validate) {
        pre.schema[name] = validate
      }
      pre.defaultValues[name] = defaultValue
      return pre
    },
    { defaultValues: {}, schema: {} }
  )

  const { register, handleSubmit, errors, setValue } = useForm({
    resolver: yupResolver(object().shape(schema)),
    shouldUnregister: true,
    defaultValues,
    mode: 'onSubmit',
  })
  const inputCtx = { errors, register, inputCx, formCx, t }

  return (
    <>
      <PaddingContainer bottom top>
        <Header
          {...{
            isMe,
            icon,
            formCx,
            t,
            default_cooldown_minutes,
            reference_symbol,
            reference_name,
            supported,
            currentMortgageBig,
            in_token_list,
            sponsor,
            pendingCount,
            countdown,
          }}
        />
        {!isMe && !isMortgageLow ? (
          <Text>
            <img src={warning}></img>
            {t('be-captain-txt')}
          </Text>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.slice(0, 5).map((props) =>
            createInput({
              ...props,
              ...inputCtx,
              onReadonly: () => setReadonlyPopup(true),
            })
          )}
          {isMe && (
            <div className={formCx('update', 'input-container')}>
              <span>{t('update-mortgage')}</span>
              <Toggle
                value={showMortgage}
                onChange={() => setShowMortgage((x) => (x = !x))}
              ></Toggle>
            </div>
          )}
          {showMortgage && (
            <>
              {createInput({
                ...inputCtx,
                ...fields[5],
                ...(isMe && { clickLabel }),
              })}
              <div className={formCx('small-text', 'bottom-text')}>
                <div>
                  {t('min-mortgage', { minMortgage: minMortgageBig + '' })}
                </div>
                <div>
                  <span>
                    {t('ceth-balance', { amount: cethBalanceDisplay })}
                  </span>
                  <span
                    onClick={() => {
                      setValue('mortgage_amount', cethBalanceBig)
                    }}
                    className={formCx('all')}
                  >
                    {t('all')}
                  </span>
                </div>
              </div>
            </>
          )}

          {shouldDisplayApprove && <Approve chain={chain} />}
          <Button
            fullWidth
            type="submit"
            loading={transactionPending}
            className={formCx('btn')}
          >
            {isMe
              ? t('update')
              : isMortgageLow
              ? t('be-captain')
              : t('compete-captain')}
          </Button>
        </form>
      </PaddingContainer>
      <Modal
        show={mortgagePopup}
        onClose={() => setMortgagePopup(false)}
        title
        ok
        content={t('mortgage-popup')}
      />
      <Modal clickAway={() => setReadonlyPopup(false)} show={readonlyPopup}>
        <span className={formCx('locked')}>
          <img src={close} alt="close" /> {t('locked')}
        </span>
      </Modal>
    </>
  )
}

const Text = styled.div`
  margin-top: 1rem;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`

function Approve({ chain }) {
  const selectedAddress = window.conflux.selectedAddress
  const { ctoken } = useTokenList({ pair: CHAIN_CONFIG[chain].mainPair })
  const operator = CONTRACT_CONFIG.custodian.fromCfx[chain].address
  const [isOperatorFor, setIsOperatorFor] = useState(null)
  const [isApproving, setIsApproveing] = useState(false)

  console.log('ctoken', ctoken)

  useEffect(() => {
    if (ctoken && selectedAddress) {
      getContract('erc777')
        .then((c) => {
          console.log(ctoken, selectedAddress, c.isOperatorFor)
          return c
            .isOperatorFor(operator, selectedAddress)
            .call({ from: selectedAddress, to: ctoken })
        })
        .then((isOperatorFor) => {
          setIsOperatorFor(isOperatorFor)
        })
    }
  }, [ctoken, selectedAddress])
  return (
    <div
      onClick={() => {
        if (!isOperatorFor) {
          setIsApproveing(true)
          getContract('erc777').then((c) => {
            return (
              c
                .authorizeOperator(operator)
                // .revokeOperator(operator)
                .sendTransaction({
                  from: selectedAddress,
                  to: ctoken,
                })
                .then((e) => {
                  console.log(e)
                })
                .catch((e) => {
                  console.log(e)
                })
                .finally(() => {
                  setIsApproveing(false)
                })
            )
          })
        }
      }}
    >
      <ApproveIcon
        status={
          isOperatorFor ? 'approved' : isApproving ? 'approving' : 'toApprove'
        }
      />
    </div>
  )
}
