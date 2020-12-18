import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from '../component/input.module.scss'
import buttonStyles from '../component/button.module.scss'
import formStyles from './Form.module.scss'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers'
import { ErrorMessage } from '@hookform/error-message'

import profile from './profile.svg'
import useTokenList from '../data/useTokenList'
import MainContainer from '../component/MainContainer/MainContainer'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import Icon from '../component/Icon/Icon'
import useCaption from '../data/useCaption'
import useConfluxPortal1 from '../lib/useConfluxPortal'

import getLatestMortgage from '../data/getLatestMortgage'
import formatAddress from '../component/formatAddress'
import formatNum from '../data/formatNum'
import useState1 from '../data/useState1'
import { Loading } from '@cfxjs/react-ui'

const __mock_balance = 10000
function CaptionForm({
  pendingCount,
  formLast,
  address,
  icon,
  reference,
  reference_symbol,
  symbol,
  reference_name,
  cAddress,
  sponsor,
  sponsor_value,
  currentMortgage,
}) {
  console.log(currentMortgage)
  const { t } = useTranslation(['caption'])
  const [inputCx, buttonCx, formCx] = useStyle(
    inputStyles,
    buttonStyles,
    formStyles
  )

  //若当前连接钱包的 Address 为该 token captain 本人时
  //token captain 规则表单中 “抵押数量”默认值为0，
  //下方说明文案变为“0 表示不更新抵押，
  //或者重新竞争 captain，需要最小抵押数量 XX cETH”。
  const isMe = address === sponsor

  const onSubmit = (data) => console.log(data)

  const minMortgage = Math.max(
    2,
    currentMortgage ? formatNum(currentMortgage, 18) * 1.1 : 0
  )

  const schema = yup.object().shape({
    inFee: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('error.above-zero'))
      .test('below-in-amount', t('error.below-in-amount'), function (params) {
        const {
          parent: { inMin },
        } = this
        return Number.isNaN(inMin) ? true : params < inMin
      }),
    outFee: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('error.above-zero'))
      .test('below-out-amount', t('error.below-out-amount'), function (params) {
        const {
          parent: { outMin },
        } = this
        return Number.isNaN(outMin) ? true : params < outMin
      }),
    inMin: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('error.above-zero'))
      .test('above-in-fee', t('error.above-in-fee'), function (params) {
        const { parent } = this
        return Number.isNaN(parent.inFee) ? true : params > parent.inFee
      }),
    outMin: yup
      .number()
      .typeError(t('error.number'))
      .test('above-out-fee', t('error.above-out-fee'), function (params) {
        const { parent } = this
        return Number.isNaN(parent.outFee) || params > parent.outFee
      }),
    wallet_fee: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('errors.above-zero')),
    minMortgage: yup
      .number()
      .typeError(t('error.number'))
      .max(__mock_balance, t('errors.insufficient'))
      .test(
        'above-current-ifnot-me',
        t('errors.above-current'),
        (v) => (isMe && v === 0) || v > minMortgage
      ),
  })

  const { register, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...{},
      minMortgage: isMe ? 0 : minMortgage,
    },
    mode: 'onBlur',
  })
  console.log(errors)
  const { minMortgage: minMortgageInput } = watch(['minMortgage'])

  //current user is caption of the symbol and
  //the mortgage of the symbol is not modified
  const selfNotUpdate = isMe && minMortgageInput === '0'

  const fields = [
    {
      label: t('shuttle-in-fee'),
      unit: symbol,
      name: 'inFee',
      readOnly: cAddress && formLast !== 0,
    },
    {
      label: t('shuttle-out-fee'),
      unit: symbol,
      name: 'outFee',
      readOnly: cAddress && formLast !== 0,
    },
    {
      label: t('shuttle-in-amount'),
      unit: reference_symbol,
      name: 'inMin',
      readOnly: cAddress && formLast !== 0,
    },
    {
      label: t('shuttle-out-amount'),
      unit: symbol,
      name: 'outMin',
      readOnly: cAddress && formLast !== 0,
    },
    {
      label: t('create-fee'),
      name: 'wallet_fee',
      unit: symbol,
      readOnly: cAddress && formLast !== 0,
    },
  ]

  return (
    <MainContainer>
      <PaddingContainer bottom top>
        <Head />
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((props) => input(props))}
          <>
            <div className={formCx('input-container')}>
              <div className={formCx('label')}>{t('morgage-amount')}</div>
              <input
                ref={register}
                name="minMortgage"
                autoComplete="off"
                data-lpignore="true"
                className={
                  inputCx(
                    'input-common',
                    errors['minMortgage'] ? 'error' : ''
                  ) +
                  ' ' +
                  formCx('input')
                }
                placeholder={t('enter')}
              />
              {selfNotUpdate && (
                <div className={formCx('for-not-update')}>
                  {t('txt.for-not-update')}
                </div>
              )}
              <div className={formCx('after')}>cETH</div>
            </div>
            <div className={formCx('small-text', 'bottom-text')}>
              <div>{t('txt.min-mortgage', { minMortgage: minMortgage })}</div>
              <div>
                <span>
                  {' '}
                  {t('txt.ceth-balance', { amount: __mock_balance })}
                </span>
                <span
                  onClick={() => {
                    setValue('minMortgage', __mock_balance)
                  }}
                  className={formCx('all')}
                >
                  {' '}
                  {t('btn.all')}
                </span>
              </div>
            </div>
            <ErrorMessage
              errors={errors}
              name="minMortgage"
              render={({ message }) => {
                return <p className={formCx('error')}>{message}</p>
              }}
            />
          </>

          <input
            type="submit"
            value={selfNotUpdate ? t('btn.update') : t('btn.be-caption')}
            className={buttonCx('btn') + ' ' + formCx('btn')}
          />
        </form>
      </PaddingContainer>
    </MainContainer>
  )

  //NOTICE:
  //input should NOT be a component, i.e. not Input
  //remounted Conponent can not be identified by register
  function input({ label, name, readOnly, unit }) {
    return (
      <div key={label}>
        <div className={formCx('input-container')}>
          <div className={formCx('label')}>{label}</div>
          <input
            ref={register}
            name={name}
            autoComplete="off"
            readOnly={readOnly}
            data-lpignore="true"
            className={
              inputCx('input-common', errors[name] ? 'error' : '') +
              ' ' +
              formCx('input')
            }
            placeholder={t('enter')}
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
    )
  }

  function Head() {
    return (
      <>
        <div className={formCx('first-container')}>
          <div className={formCx('left')}>
            <Icon src={icon} style={{ marginRight: '1rem' }} />
            <div className={formCx('left-text')}>
              <div className={formCx('large-text')}>{reference_symbol}</div>
              <div className={formCx('small-text')}>{reference_name}</div>
            </div>
          </div>
          <div className={formCx('right')}>
            <div className={formCx('large-text')}>
              {(minMortgage ? formatNum(currentMortgage, 18) : '--') + ' cETH'}
            </div>
            <div
              className={formCx('small-text')}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                alt="profile"
                className={formCx('profile')}
                src={profile}
              ></img>
              <span>{sponsor ? formatAddress(sponsor) : '--'}</span>
            </div>
          </div>
        </div>
        <div className={formCx('second-container')}>
          <div className={formCx('second-item')}>
            <div className={formCx('large-text')}>{pendingCount || '--'}</div>
            <div className={formCx('small-text', 'mTop')}>
              {t('pending-count')}
            </div>
          </div>
          <div className={formCx('second-item')}>
            <div className={formCx('large-text')}>
              {formLast && formLast < 3 * 60 * 60 ? (
                <Countdown initValue={3 * 60 * 60 - formLast} />
              ) : (
                formatSec(0)
              )}
            </div>
            <div className={formCx('small-text', 'mTop')}>{t('countdown')}</div>
          </div>
        </div>
      </>
    )
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

function Countdown({ initValue }) {
  const [value, setValue] = useState(initValue)
  useEffect(() => {
    if (initValue > 0) {
      const timer = setInterval(() => {
        setValue((x) => Math.max(x - 1, 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [initValue])
  if (initValue > 0) {
    return formatSec(value)
  } else {
    return formatSec(0)
  }
}

export default function CaptionFormData() {
  const { erc20 } = useParams()
  const { address } = useConfluxPortal1()
  /**
   * tokens will change on every render(no cache in useTokenList)
   * which will into invalid all the following identity check
   * no a big problem though
   */
  const { tokens } = useTokenList({ erc20 })
  const tokenInfo = useMemo(
    () => (tokens && tokens.length > 0 ? tokens[0] : {}),
    [tokens]
  )
  const { pendingCount, formLast } = useCaption(tokenInfo.reference)

  const [currentMortgage, setCurrentMortgage] = useState()

  const updateMinMortgage = useCallback((reference) => {
    getLatestMortgage(reference).then((x) => {
      setCurrentMortgage(x && x.toString())
    })
  }, [])

  useEffect(() => {
    if (tokenInfo.reference) {
      updateMinMortgage(tokenInfo.reference)
    }
  }, [updateMinMortgage, tokenInfo.reference])
  const data = {
    address,
    ...tokenInfo,
    pendingCount,
    formLast,
    currentMortgage,
  }
  /**
   * the form default value can be read ONLY ONCE
   * make sure the default from data available when
   * the form compoment rendered the first time
   **/
  if (typeof pendingCount === 'number' && currentMortgage) {
    return <CaptionForm {...data} />
  } else {
    return <Loading size="large" />
  }
}
