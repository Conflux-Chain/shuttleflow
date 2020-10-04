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


const __mock_balance = 10000
export default function CaptionForm({ token }) {
  const { t } = useTranslation()
  const [inputCx, buttonCx, formCx] = useStyle(inputStyles, buttonStyles, formStyles)
  const { data: tokenInfo } = useSWR(['/address', token], swrSearchTokenFetcher, { suspense: true })
  //cAddress 判定跨链与否
  const { outFee, icon, symbol, cSymbol, name, minMortgage, cAddress } = tokenInfo

  //we do not need to call the contract if we know the token is not available
  const { data: captionInfo } = useSWR(cAddress ? ['/caption', 'caption_unlocked_me'] : null, swrCaptionFetcher, { suspense: true })
  const { countdown, caption, pending_mount, pending_cost } = captionInfo ||
    { countdown: 0, caption: '--', pending_mount: '--', pending_cost: '--' }

  //若当前连接钱包的 Address 为该 token captain 本人时
  //token captain 规则表单中 “抵押数量”默认值为0，
  //下方说明文案变为“0 表示不更新抵押，
  //或者重新竞争 captain，需要最小抵押数量 XX cETH”。
  const isMe = caption === '0x_address_of_me'

  const onSubmit = data => console.log(data);

  const _minMortgage = Math.max(2, minMortgage ? minMortgage * 1.1 : 0)

  const schema = yup.object().shape({
    inFee: yup
      .number()
      .typeError(t('errors.number'))
      .min(0, t('errors.above-zero'))
      .test('below-in-fee', t('errors.below-in-fee'),
        function (params) {
          const { parent } = this
          return Number.isNaN(parent.inMin) || (params < parent.inMin)
        }),
    outFee: yup
      .number()
      .typeError(t('errors.number'))
      .min(0, t('errors.above-zero'))
      .test('below-in-fee', t('errors.below-out-fee'),
        function (params) {
          const { parent } = this
          return Number.isNaN(parent.outMin) || (params < parent.outMin)
        }),
    inMin: yup
      .number()
      .typeError(t('errors.number'))
      .min(0, t('errors.above-zero'))
      .test('above-in-fee', t('errors.above-in-fee'),
        function (params) {
          const { parent } = this
          return Number.isNaN(parent.inFee) || (params > parent.inFee)
        })
    ,
    outMin: yup
      .number()
      .typeError(t('errors.number'))
      .test('above-out-fee', t('errors.above-in-fee'),
        function (params) {
          const { parent } = this
          return Number.isNaN(parent.outFee) || (params > parent.outFee)
        }),
    wallet_fee:
      yup
        .number()
        .typeError(t('errors.number'))
        .min(0, t('errors.above-zero')),
    minMortgage: yup.number()
      //todo: not sure isMe or _minMortgage
      //will be cached incorrectly due to closure
      .typeError(t('errors.number'))
      .max(__mock_balance, t('errors.insufficient'))
      .test('above-current-ifnot-me',
        t('errors.above-current'),
        (v) => (isMe && v === 0) || v > _minMortgage)
  });


  const { register, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...tokenInfo,
      minMortgage: !cAddress ? 2 : (isMe ? 0 : _minMortgage)
    },
    mode: 'onBlur'
  })
  const { minMortgage: minMortgageInput } = watch(['minMortgage'])

  //current user is caption of the symbol and
  //the mortgage of the symbol is not modified
  const selfNotUpdate = isMe && minMortgageInput === '0'

  const fields = [
    {
      label: t('label.shuttle-in-fee'),
      unit: cSymbol,
      name: 'inFee',
      readOnly: cAddress && countdown !== 0
    },
    {
      label: t('label.shuttle-out-fee'),
      unit: cSymbol,
      name: 'outFee',
      readOnly: cAddress && countdown !== 0
    },
    {
      label: t('label.shuttle-in-amount'),
      unit: symbol,
      name: 'inMin',
      readOnly: cAddress && countdown !== 0
    },
    {
      label: t('label.shuttle-out-amount'),
      unit: cSymbol,
      name: 'outMin',
      readOnly: cAddress && countdown !== 0
    },
    {
      label: t('label.create-fee'),
      name: 'wallet_fee',
      unit: cSymbol,
      readOnly: cAddress && countdown !== 0
    },
  ]


  console.log(errors)
  return (
    <div>
      <Head />
      <form onSubmit={handleSubmit(onSubmit)}>
        {
          fields
            .map((props, i) => input(props))

        }
        <>
          <div className={formCx('input-container')}>
            <div className={formCx('label')}>{t('label.morgage-amount')}</div>
            <input
              ref={register}
              name='minMortgage'
              autoComplete='off'
              data-lpignore="true"
              className={inputCx('input-common', errors['minMortgage'] ? 'error' : '') + ' ' + formCx('input')}
              placeholder={t('placeholder.enter')}
            />
            {selfNotUpdate && <div className={formCx('for-not-update')}>{t('txt.for-not-update')}</div>}
            <div className={formCx('after')}>cETH</div>
          </div>
          <div className={formCx('small-text', 'bottom-text')}>
            <div>{t('txt.min-mortgage', { minMortgage: _minMortgage })}</div>
            <div>
              <span> {t('txt.ceth-balance', { amount: __mock_balance })}</span>
              <span
                onClick={() => { setValue('minMortgage', __mock_balance) }}
                className={formCx('all')}> {t('btn.all')}</span>
            </div>
          </div>
          <ErrorMessage
            errors={errors}
            name='minMortgage'
            render={({ message }) => {
              return <p className={formCx('error')}>{message}</p>
            }}
          />
        </>

        <input
          type='submit'
          value={selfNotUpdate ? t('btn.update') : t('btn.be-caption')}
          className={buttonCx('btn') + ' ' + formCx('btn')} />
      </form>
    </div>
  )

  //NOTICE:
  //input should NOT be a component, i.e. not Input
  //remounted Conponent can not be identified by register
  function input({ label, name, readOnly, unit }) {
    return <div key={label}>
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

  function Head() {
    return (<>
      <div className={formCx('first-container')}>
        <div className={formCx('left')}>
          <img className={formCx('icon')} alt='logo' src={icon}></img>
          <div className={formCx('left-text')}>
            <div className={formCx('large-text')}>{symbol}</div>
            <div className={formCx('small-text')}>{name}</div>
          </div>
        </div>
        <div className={formCx('right')}>
          <div className={formCx('large-text')}>{(minMortgage || '--') + ' cETH'}</div>
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
    </>)
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
