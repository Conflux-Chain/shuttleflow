import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from '../component/input.module.scss'
import buttonStyles from '../component/button.module.scss'
import formStyles from './Form.module.scss'
import modalStyles from '../component/modal.module.scss'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { object } from 'yup'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'

import profile from './profile.svg'
import useTokenList from '../data/useTokenList'

import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import Icon from '../component/Icon/Icon'
import useCaptain from '../data/captain'

import getLatestMortgage from '../data/getLatestMortgage'
import formatAddress from '../component/formatAddress'
import createBeCaptain from '../data/beCaptain'
import formatNum, { buildNum, parseNum } from '../data/formatNum'
import { Loading } from '@cfxjs/react-ui'
import { CETH_ADDRESS } from '../config/config'
import Modal from '../component/Modal'

import success from './success.png'
import fail from './fail.png'
import WithQuestion from '../component/WithQuestion'
import { create as big } from '../lib/BigNumberSchema'
import useAddress from '../data/useAddress'
import { useBalance } from '../data/useBalance'

function CaptainForm({
  pendingCount,
  countdown,
  address,
  icon,
  beCaptain,
  cethBalance,
  burn_fee,
  mint_fee,
  minMortgage,
  minimal_burn_value,
  minimal_mint_value,
  reference_symbol,
  reference_name,
  wallet_fee,
  supported,
  sponsor,
  currentMortgage,
}) {
  const { t } = useTranslation(['captain'])
  const [inputCx, buttonCx, formCx] = useStyle(
    inputStyles,
    buttonStyles,
    formStyles
  )

  const isAll = useRef(false)

  //若当前连接钱包的 Address 为该 token captain 本人时
  //token captain 规则表单中 “抵押数量”默认值为0，
  //下方说明文案变为“0 表示不更新抵押，
  //或者重新竞争 captain，需要最小抵押数量 XX cETH”。
  const isMe = address === sponsor

  const onSubmit = (data) => {
    // return
    beCaptain({
      amount: data.mortgage_amount,
      burnFee: data.burn_fee,
      mintFee: data.mint_fee,
      walletFee: data.wallet_fee,
      minimalMintValue: data.minimal_mint_value,
      minimalBurnValue: data.minimal_burn_value,
    })
  }

  minMortgage = Math.max(
    minMortgage,
    currentMortgage ? formatNum(currentMortgage, 18) * 1.1 : 0
  )

  const field = () => {
    return big().typeError(t('error.number')).aboveZero(t('error.above-zero'))
  }
  const schema = object().shape({
    mint_fee: field(),
    burn_fee: field(),
    minimal_mint_value: field().greaterThan(
      'mint_fee',
      t('error.above-in-fee')
    ),
    minimal_burn_value: field().greaterThan(
      'burn_fee',
      t('error.above-out-fee')
    ),
    wallet_fee: field(),
    // mortgage_amount: yup.string(),
    // .number()
    // .typeError(t('error.number'))
    // .max(cethBalanceDisplay, t('error.insufficient'))
    // .test(
    //   'above-current-ifnot-me',
    //   t('error.above-current'),
    //   (v) => (isMe && v === 0) || v > minMortgage
    // ),
  })

  const { register, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mint_fee,
      burn_fee,
      minimal_mint_value,
      minimal_burn_value,
      wallet_fee,
      mortgage_amount: isMe ? '0' : minMortgage,
    },
    mode: 'onSubmit',
  })
  const { mortgage_amount: minMortgageInput } = watch(['mortgage_amount'])

  //current user is captain of the symbol and
  //the mortgage of the symbol is not modified
  const isUpdate = isMe && minMortgageInput === '0'

  const fields = [
    {
      label: t('shuttle-in-fee'),
      unit: reference_symbol,
      name: 'mint_fee',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('shuttle-in-amount'),
      unit: reference_symbol,
      name: 'minimal_mint_value',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('shuttle-out-fee'),
      unit: reference_symbol,
      name: 'burn_fee',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('shuttle-out-amount'),
      unit: reference_symbol,
      name: 'minimal_burn_value',
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('create-fee'),
      name: 'wallet_fee',
      unit: reference_symbol,
      readOnly: supported && countdown !== 0,
    },
    {
      label: t('morgage-amount'),
      name: 'mortgage_amount',
      unit: 'cETH',
      readOnly: false,
    },
  ]
  return (
    <PaddingContainer bottom top>
      <Head
        {...{
          icon,
          formCx,
          t,
          reference_symbol,
          reference_name,
          supported,
          currentMortgage,
          sponsor,
          pendingCount,
          countdown,
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((props) => input(props))}
        <>
          <div className={formCx('small-text', 'bottom-text')}>
            <div>{t('min-mortgage', { minMortgage })}</div>
            <div>
              <span> {t('ceth-balance', { amount: cethBalance })}</span>
              <span
                onClick={() => {
                  isAll.current = true
                  setValue('mortgage_amount', cethBalance)
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
          value={isUpdate ? t('update') : t('be-captain')}
          className={buttonCx('btn') + ' ' + formCx('btn')}
        />
      </form>
    </PaddingContainer>
  )

  //NOTICE:
  //input should NOT be a component, i.e. not Input
  //remounted Conponent can not be identified by register
  function input({ label, name, readOnly, unit }) {
    return (
      <div key={label}>
        <div
          className={
            inputCx('input-common', errors[name] ? 'error' : '') +
            ' ' +
            formCx('input-container')
          }
        >
          <div className={formCx('label')}>{label}</div>
          <input
            ref={register}
            name={name}
            autoComplete="off"
            readOnly={readOnly}
            data-lpignore="true"
            className={inputCx('input-common') + ' ' + formCx('input')}
            placeholder={t('enter')}
            // onChange={(e) => {
            //   let value = e.target.value
            //   e.target.value = value.slice(0, 8)
            // }}
          />
          <div className={formCx('after')}>
            {unit && unit.length > 20 ? unit.slice(0, 20) + '...' : unit}
          </div>
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
}

function Head({
  icon,
  formCx,
  t,
  reference_symbol,
  reference_name,
  supported,
  currentMortgage,
  sponsor,
  pendingCount,
  countdown,
}) {
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
            {(supported ? formatNum(currentMortgage, 18) : '--') + ' cETH'}
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
          <div className={formCx('large-text')}>
            {supported ? pendingCount : '--'}
          </div>
          <div className={formCx('small-text', 'mTop')}>
            {t('pending-count')}
          </div>
        </div>
        <div className={formCx('second-item')}>
          <div className={formCx('large-text')}>
            {!supported ? (
              '--'
            ) : countdown && countdown !== 0 ? (
              <Countdown initValue={countdown} />
            ) : (
              formatSec(0)
            )}
          </div>
          <div className={formCx('small-text', 'mTop')}>
            <WithQuestion>{t('countdown')}</WithQuestion>
          </div>
        </div>
      </div>
    </>
  )
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

//0xd50931bb32fca14acbc0cade5850ba597f3ee1a6
export default function CaptainFormData() {
  const { erc20 } = useParams()
  const [popup, setPopup] = useState('')
  const { t } = useTranslation(['captain'])
  const [cx, modalCx] = useStyle(formStyles, modalStyles)
  const address = useAddress()
  const cethBalance = useBalance(CETH_ADDRESS)

  // const address = useAddress()
  // console.log('address', address)
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

  const { decimals } = tokenInfo
  const { pendingCount, countdown, minMortgage } = useCaptain(
    tokenInfo.reference
  )

  const [currentMortgage, setCurrentMortgage] = useState()
  const beCaptain = function ({
    amount,
    burnFee,
    mintFee,
    walletFee,
    minimalMintValue,
    minimalBurnValue,
  }) {
    createBeCaptain(
      address,
      erc20
    )({
      amount: buildNum(amount, 18),
      burnFee: buildNum(burnFee, decimals),
      mintFee: buildNum(mintFee, decimals),
      walletFee: buildNum(walletFee, decimals),
      minimalMintValue: buildNum(minimalMintValue, decimals),
      minimalBurnValue: buildNum(minimalBurnValue, decimals),
    })
      .then((e) => {
        console.log(e)
        setPopup('success')
      })
      .catch(() => {
        setPopup('fail')
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
  if (
    // false &&
    typeof pendingCount === 'number' &&
    currentMortgage &&
    cethBalance
  ) {
    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
      currentMortgage,
      beCaptain,
      minMortgage,
      cethBalance: parseNum(cethBalance, 18),
    }
    return (
      <>
        <CaptainForm {...data} />
        <Modal show={popup} clickAway={() => setPopup(false)}>
          <img
            className={cx('status-img')}
            src={popup === 'success' ? success : fail}
            alt="status"
          ></img>
          <div className={modalCx('title')}>
            {t(popup === 'success' ? 'success' : 'fail')}
          </div>
          <div onClick={() => setPopup('')} className={modalCx('btn')}>
            {t('popup.ok')}
          </div>
        </Modal>
      </>
    )
  } else {
    return (
      <div className={cx('loading-container')}>
        <Loading size="large" />
      </div>
    )
  }
}
