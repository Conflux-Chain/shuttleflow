import React from 'react'
import useStyle from '../../component/useStyle'
import inputStyles from '../../component/input.module.scss'
import buttonStyles from '../../component/button.module.scss'
import formStyles from './Form.module.scss'
import { useTranslation } from 'react-i18next'
import swrSearchTokenFetcher from '../../data/mock/swrSearchTokenFetcher'
import swrCaptionFetcher from '../../data/mock/swrCaptionFetcher'

import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import { ErrorMessage } from "@hookform/error-message";



export default function CaptionForm({ token }) {
  const { t } = useTranslation()
  const [inputCx, buttonCx, formCx] = useStyle(inputStyles, buttonStyles, formStyles)
  const { data: tokenInfo } = useSWR(['/address', token], swrSearchTokenFetcher, { suspense: true })
  const { data: captionInfo } = useSWR(['/caption', 'caption_locked_me'], swrCaptionFetcher, { suspense: true })

  const { inFee, outFee, icon, symbol, cSymbol, name, minMortgage } = tokenInfo
  const { countdown, caption, pending_mount, pending_cost } = captionInfo


  const onSubmit = data => console.log(data);

  const _minMortgage = Math.max(2, minMortgage * 1.1)
  const schema = yup.object().shape({
    inFee: yup
      .number()
      .typeError(t('errors.number'))
      .min(0, t('errors.above-zero')),
    outFee: yup
      .number()
      .typeError(t('errors.number'))
      .min(0, t('errors.above-zero')),
    inMin: yup
      .number()
      .typeError(t('errors.number'))
      .min(inFee, t('errors.above-fee')),
    outMin: yup
      .number()
      .typeError(t('errors.number'))
      .min(outFee, t('errors.above-fee')),
    wallet_fee:
      yup
        .number()
        .typeError(t('errors.number'))
        .min(0, t('errors.above-zero')),
    minMortgage:
      yup
        .number()
        .typeError(t('errors.number'))
        .min(_minMortgage, t('errors.above-current')),
  });


  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...tokenInfo,
      minMortgage: _minMortgage
    },
    mode: 'onBlur'
  })

  const fields = [
    {
      label: t('label.shuttle-in-fee'),
      unit: cSymbol,
      name: 'inFee',
      readOnly: countdown !== 0
    },
    {
      label: t('label.shuttle-out-fee'),
      unit: cSymbol,
      name: 'outFee',
      readOnly: countdown !== 0
    },
    {
      label: t('label.shuttle-in-amount'),
      unit: symbol,
      name: 'inMin',
      readOnly: countdown !== 0
    },
    {
      label: t('label.shuttle-out-amount'),
      unit: cSymbol,
      name: 'outMin',
      readOnly: countdown !== 0
    },
    {
      label: t('label.create-fee'),
      name: 'wallet_fee',
      unit: cSymbol,
      readOnly: countdown !== 0
    },
    {
      label: t('label.morgage-amount'),
      unit: 'cETH',
      name: 'minMortgage',
      readOnly: false
    },

  ]


  return (
    <div>
      <div className={formCx('first-container')}>
        <div className={formCx('left')}>
          <img className={formCx('icon')} alt='logo' src={icon}></img>
          <div className={formCx('left-text')}>
            <div className={formCx('large-text')}>{symbol}</div>
            <div className={formCx('small-text')}>{name}</div>
          </div>
        </div>
        <div className={formCx('right')}>
          <div className={formCx('large-text')}>{minMortgage + ' cETH'}</div>
          <div className={formCx('small-text')}>{caption}</div>
        </div>
      </div>
      <div className={formCx('second-container')}>
        <div className={formCx('second-item')}>
          <div className={formCx('large-text')}>{pending_mount}</div>
          <div className={formCx('small-text', 'mTop')}>{t('txt.pending-amount')}</div>
        </div>
        <div className={formCx('second-item')}>
          <div className={formCx('large-text')}>{pending_cost}</div>
          <div className={formCx('small-text', 'mTop')}>{t('txt.pending-cost')}</div>
        </div>
        <div className={formCx('second-item')}>
          <div className={formCx('large-text')}>{formatSec(countdown)}</div>
          <div className={formCx('small-text', 'mTop')}>{t('txt.lock-down')}</div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {
          fields
            .map((props, i) => <Input key={i} {...props} />)
        }
        <div className={formCx('small-text')}>
          <div>{t('txt.min-mortgage', { minMortgage: _minMortgage })}</div>
          <div>
            <span> {t('txt.ceth-balance', { amount: 10000 })}</span>
            <span> {t('btn.all')}</span>
          </div>

        </div>
        <input
          type='submit'
          value={'be caption'}
          className={buttonCx('btn')} />
      </form>
    </div>
  )

  function Input({ label, name, readOnly, unit }) {
    return <div>
      <div className={formCx('input-container')}>
        <div className={formCx('label')}>{label}</div>
        <input
          ref={register}
          name={name}
          autoComplete='off'
          readOnly={readOnly}
          data-lpignore="true"
          className={inputCx('input-common', errors[name] ? 'error' : '') + ' ' + formCx('input')}
          placeholder={t('placeholder.enter')}
        />
        <div className={formCx('after')}>{unit}</div>
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => {
          return <p className={formCx('error')}>{message}</p>
        }}
      />
    </div>
  }
}




function formatSec(sec) {
  let hour = parseInt(sec / 3600)
  sec -= hour * 3600
  const minute = parseInt(sec / 60)
  sec -= minute * 60
  return [hour, minute, sec].map(padZero).join(':')
}

function padZero(value) {
  value += ''
  if (value.length === 1) {
    value = '0' + value
  }
  return value
}
