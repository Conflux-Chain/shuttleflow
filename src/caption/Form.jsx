import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from '../component/input.module.scss'
import buttonStyles from '../component/button.module.scss'
import formStyles from './Form.module.scss'
import modalStyles from '../component/modal.module.scss'
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
import createBeCaption from '../data/beCaption'
import formatNum from '../data/formatNum'
import { Loading } from '@cfxjs/react-ui'
import { CETH_ADDRESS } from '../config/config'
import Modal from '../component/Modal'

import success from './success.png'
import fail from './fail.png'

function CaptionForm({
  pendingCount,
  countdown,
  address,
  icon,
  symbol,
  beCaption,
  cethBalance,
  cethBalanceDisplay,
  burn_fee,
  mint_fee,
  minimal_burn_value,
  minimal_mint_value,
  reference_symbol,
  reference_name,
  wallet_fee,
  supported,
  sponsor,
  currentMortgage,
}) {
  const { t } = useTranslation(['caption'])
  const [inputCx, buttonCx, formCx] = useStyle(
    inputStyles,
    buttonStyles,
    formStyles
  )

  const isAll = useRef(false)

  // cethDisplay=200

  //若当前连接钱包的 Address 为该 token captain 本人时
  //token captain 规则表单中 “抵押数量”默认值为0，
  //下方说明文案变为“0 表示不更新抵押，
  //或者重新竞争 captain，需要最小抵押数量 XX cETH”。
  const isMe = address === sponsor

  const onSubmit = (data) => {
    const _data = Object.assign({}, data)
    console.log(_data)
    beCaption({
      amount: isAll.current ? cethBalance : data.mortgage_amount * 1e18,
      burnFee: data.burn_fee,
      mintFee: data.mint_fee,
      walletFee: data.wallet_fee,
      minimalMintValue: data.minimal_mint_value,
      minimalBurnValue: data.minimal_burn_value,
    })
  }

  const minMortgage = Math.max(
    2,
    currentMortgage ? formatNum(currentMortgage, 18) * 1.1 : 0
  )

  const schema = yup.object().shape({
    mint_fee: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('error.above-zero'))
      .test('below-in-amount', t('error.below-in-amount'), function (params) {
        const {
          parent: { minimal_mint_value },
        } = this
        return Number.isNaN(minimal_mint_value)
          ? true
          : params < minimal_mint_value
      }),
    burn_fee: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('error.above-zero'))
      .test('below-out-amount', t('error.below-out-amount'), function (params) {
        const {
          parent: { minimal_burn_value },
        } = this
        return Number.isNaN(minimal_burn_value)
          ? true
          : params < minimal_burn_value
      }),
    minimal_mint_value: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('error.above-zero'))
      .test('above-in-fee', t('error.above-in-fee'), function (params) {
        const { parent } = this
        return Number.isNaN(parent.mint_fee) ? true : params > parent.mint_fee
      }),
    minimal_burn_value: yup
      .number()
      .typeError(t('error.number'))
      .test('above-out-fee', t('error.above-out-fee'), function (params) {
        const { parent } = this
        return Number.isNaN(parent.burn_fee) || params > parent.burn_fee
      }),
    wallet_fee: yup
      .number()
      .typeError(t('error.number'))
      .min(0, t('errors.above-zero')),
    mortgage_amount: yup
      .number()
      .typeError(t('error.number'))
      .max(cethBalanceDisplay, t('error.insufficient'))
      .test(
        'above-current-ifnot-me',
        t('error.above-current'),
        (v) => (isMe && v === 0) || v > minMortgage
      ),
  })

  const { register, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mint_fee: mint_fee,
      burn_fee: burn_fee,
      minimal_mint_value: minimal_mint_value,
      minimal_burn_value: minimal_burn_value,
      wallet_fee,
      mortgage_amount: isMe ? 0 : minMortgage,
    },
    mode: 'onBlur',
  })
  console.log(errors)
  const { mortgage_amount: minMortgageInput } = watch(['mortgage_amount'])

  //current user is caption of the symbol and
  //the mortgage of the symbol is not modified
  const isUpdate = isMe && minMortgageInput === '0'

  const fields = [
    {
      label: t('shuttle-in-fee'),
      unit: symbol,
      name: 'mint_fee',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('shuttle-out-fee'),
      unit: symbol,
      name: 'burn_fee',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('shuttle-in-amount'),
      unit: reference_symbol,
      name: 'minimal_mint_value',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('shuttle-out-amount'),
      unit: symbol,
      name: 'minimal_burn_value',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('create-fee'),
      name: 'wallet_fee',
      unit: symbol,
      readOnly: supported && countdown !== 0,
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
                name="mortgage_amount"
                autoComplete="off"
                data-lpignore="true"
                onChange={(e) => {
                  let value = e.target.value
                  let [p1, p2] = value.split('.')
                  if (p2) {
                    p2 = p2.slice(0, 6)
                    value = [p1, p2].join('.')
                  }
                  e.target.value = value
                  isAll.current = false
                }}
                className={
                  inputCx(
                    'input-common',
                    errors['mortgage_amount'] ? 'error' : ''
                  ) +
                  ' ' +
                  formCx('input')
                }
                placeholder={t('enter')}
              />
              {isUpdate && (
                <div className={formCx('for-not-update')}>
                  {t('for-not-update')}
                </div>
              )}
              <div className={formCx('after')}>cETH</div>
            </div>
            <div className={formCx('small-text', 'bottom-text')}>
              <div>{t('min-mortgage', { minMortgage })}</div>
              <div>
                <span>
                  {' '}
                  {t('ceth-balance', { amount: cethBalanceDisplay })}
                </span>
                <span
                  onClick={() => {
                    isAll.current = true
                    setValue('mortgage_amount', cethBalanceDisplay)
                  }}
                  className={formCx('all')}
                >
                  {t('all')}
                </span>
              </div>
            </div>
            <ErrorMessage
              errors={errors}
              name="mortgage_amount"
              render={({ message }) => {
                return <p className={formCx('error')}>{message}</p>
              }}
            />
          </>

          <input
            type="submit"
            value={isUpdate ? t('update') : t('be-caption')}
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
              {(currentMortgage ? formatNum(currentMortgage, 18) : '--') +
                ' cETH'}
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
              {countdown && countdown !== 0 ? (
                <Countdown initValue={countdown} />
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
  const [popup, setPopup] = useState('')
  const { t } = useTranslation(['caption'])
  const [cx, modalCx] = useStyle(formStyles, modalStyles)
  const {
    address,
    balances: [, [cethBalance]],
  } = useConfluxPortal1([CETH_ADDRESS])
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
  const { pendingCount, countdown } = useCaption(tokenInfo.reference)

  const [currentMortgage, setCurrentMortgage] = useState()

  const beCaption = function (...args) {
    createBeCaption(
      address,
      erc20
    )(...args)
      .then((e) => {
        console.log(e)
        setPopup('success')
      })
      .catch((e) => {
        setPopup('fail')
        console.log(e)
      })
  }

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

  /**
   * the form default value can be read ONLY ONCE
   * make sure the default from data available when
   * the form compoment rendered the first time
   **/
  if (typeof pendingCount === 'number' && currentMortgage && cethBalance) {
    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
      currentMortgage,
      beCaption,
      cethBalance,
      cethBalanceDisplay: formatNum(cethBalance, 18),
    }
    console.log(data)
    return (
      <>
        <CaptionForm {...data} />
        <Modal show={popup} clickAway={() => setPopup(false)}>
          <img
            className={cx('status-img')}
            src={popup === 'success' ? success : fail}
            alt="status"
          ></img>
          <div className={modalCx('title')}>
            {t(popup === 'success' ? 'success' : 'fail')}
          </div>
          <div className={modalCx('btn')}>{t('popup.ok')}</div>
        </Modal>
      </>
    )
  } else {
    return <Loading size="large" />
  }
}
