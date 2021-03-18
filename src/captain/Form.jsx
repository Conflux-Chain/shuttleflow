import React, { useState } from 'react'
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

import Button from '../component/Button/Button'

export default function CaptainForm({
  pendingCount,
  countdown,
  cooldownMinutes,
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
}) {
  const { t } = useTranslation(['captain'])
  const [inputCx, formCx] = useStyle(inputStyles, formStyles)
  const [mortgagePopup, setMortgagePopup] = useState(false)
  const [readonlyPopup, setReadonlyPopup] = useState(false)

  function clickLabel() {
    setMortgagePopup(true)
  }
  const isMe = address === sponsor
  const isMortgageLow = safeSponsorAmount.gt(currentMortgageBig)
  console.log('===', safeSponsorAmount, currentMortgageBig, isMortgageLow)
  const [showMortgage, setShowMortgage] = useState(!isMe)

  const onSubmit = (data) => {
    // return
    console.log(data)
    beCaptain({
      amount: data.mortgage_amount,
      burnFee: data.burn_fee,
      mintFee: data.mint_fee,
      walletFee: data.wallet_fee,
      minimalMintValue: data.minimal_mint_value,
      minimalBurnValue: data.minimal_burn_value,
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
    countdown,
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
            reference_symbol,
            reference_name,
            supported,
            currentMortgageBig,
            in_token_list,
            sponsor,
            pendingCount,
            countdown,
            cooldownMinutes,
          }}
        />
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

          <Button
            type="submit"
            disabled={!showMortgage && countdown !== 0}
            className={formCx('btn')}
          >
            {isMe ? t('update') : t('be-captain')}
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
