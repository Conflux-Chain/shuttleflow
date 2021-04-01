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
import warning from './warning.svg'
import info from './info.svg'

import ApproveIcon from './ApproveIcon'

import Button from '../component/Button/Button'
import styled from 'styled-components'
import { CONTRACT_CONFIG, getContract } from '../data/contract/contract'
import CHAIN_CONFIG from '../config/chainConfig'
import { useParams } from 'react-router'
import { usePairInfo } from '../data/useTokenList'
import { giveTransactionResult } from '../globalPopup/TranscationResult'
import useAddress from '../data/useAddress'

export default function CaptainForm({ pair }) {
  const { data: tokenInfo } = usePairInfo(pair)
  const address = useAddress()
  const [disabled, setDisabled] = useState()
  const {
    origin,
    icon,
    minimal_sponsor_amount,
    sponsorValue,
    gasBalance,
    gasBalanceDisplay,
    safe_sponsor_amount,
    supported,
    sponsor,
    mainPairSymbol,
    countdown,
    beCaptain,
  } = tokenInfo

  const { chain } = useParams()
  const shouldDisplayApprove = origin === 'cfx'

  const { t } = useTranslation(['captain'])
  const [inputCx, formCx] = useStyle(inputStyles, formStyles)
  const [mortgagePopup, setMortgagePopup] = useState(false)
  const [transactionPending, setTranscationPending] = useState(false)

  function clickLabel() {
    setMortgagePopup(true)
  }
  const isMe = address === sponsor
  const isMortgageLow = safe_sponsor_amount.gt(sponsorValue)
  const isLocking = countdown > 0

  const [showMortgage, setShowMortgage] = useState(!isMe)

  const onSubmit = (data) => {
    if (!transactionPending) {
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
  }
  const fields = getFields({
    t,
    isMe,
    isMortgageLow,
    isLocking,
    showMortgage,
    ...tokenInfo,
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
            formCx,
            t,
            icon,
            ...tokenInfo,
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
                  {t('mainPair-min-mortgage', {
                    minMortgage: minimal_sponsor_amount + '',
                    mainPair: mainPairSymbol,
                  })}
                </div>
                <div>
                  <span>
                    {t('mainPair-balance', {
                      amount: gasBalanceDisplay,
                      mainPair: mainPairSymbol,
                    })}
                  </span>
                  <span
                    onClick={() => {
                      setValue('mortgage_amount', gasBalance)
                    }}
                    className={formCx('all')}
                  >
                    {t('all')}
                  </span>
                </div>
              </div>
            </>
          )}

          {shouldDisplayApprove && (
            <Approve setDisabled={setDisabled} t={t} chain={chain} />
          )}
          {!supported && (
            <CaptainCreate>
              <img src={info}></img> {t('captain-create')}
            </CaptainCreate>
          )}
          <Button
            fullWidth
            disabled={disabled}
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
    </>
  )
}

const CaptainCreate = styled.div`
  color: white;
  margin-top: 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`
const Text = styled.div`
  margin-top: 16px;
  margin-bottom: -4px;
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

function Approve({ chain, t, setDisabled }) {
  const selectedAddress = window.conflux.selectedAddress
  const { ctoken } = usePairInfo(CHAIN_CONFIG[chain].mainPair).data
  const operator = CONTRACT_CONFIG.custodian.fromCfx[chain].address
  const [isOperatorFor, setIsOperatorFor] = useState(null)
  const [isApproving, setIsApproveing] = useState(false)

  useEffect(() => {
    setDisabled(!isOperatorFor)
  }, [isOperatorFor])

  useEffect(() => {
    if (ctoken && selectedAddress) {
      getContract('erc777')
        .then((c) => {
          return c
            .isOperatorFor(operator, selectedAddress)
            .call({ from: selectedAddress, to: ctoken })
        })
        .then((isOperatorFor) => {
          setIsOperatorFor(isOperatorFor)
          // setDisabled(!isOperatorFor)
        })
    }
  }, [ctoken, selectedAddress])
  return (
    <ApproveContainer
      onClick={() => {
        if (!isOperatorFor) {
          setIsApproveing(true)
          giveTransactionResult(
            getContract('erc777').then((c) =>
              c
                .authorizeOperator(operator)
                // .revokeOperator(operator)
                .sendTransaction({
                  from: selectedAddress,
                  to: ctoken,
                })
            ),
            {
              done: () => {
                setIsApproveing(false)
                setIsOperatorFor(true)
              },
            }
          )
        }
      }}
    >
      <ApproveIcon
        status={
          isOperatorFor ? 'approved' : isApproving ? 'approving' : 'toApprove'
        }
      />
      <div style={{ marginLeft: 8 }}>{t('approve')}</div>
    </ApproveContainer>
  )
}

const ApproveContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  color: #6fcf97;
  font-size: 14px;
`
