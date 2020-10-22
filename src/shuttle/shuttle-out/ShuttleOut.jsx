import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import useCToken from '@cfxjs/react-hooks/lib/useCToken'

import inputStyles from '../../component/input.module.scss'
import buttonStyles from '../../component/button.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleOutStyles from './ShuttleOut.module.scss'
import modalStyles from '../../component/modal.module.scss'
import Modal from '../../component/Modal'

import useStyle from '../../component/useStyle'

import clear from '../../component/clear.svg'
import down from '../down.svg'
import question from '../../component/question.svg'
import fail from './fail.svg'
import sent from './sent.svg'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'
import { ErrorMessage } from '@hookform/error-message'

import { buildSearch, parseSearch } from '../../component/urlSearch'
import useTokenList from '../../data/useTokenList'

import ShuttleHistory from '../../history/ShuttleHistory'
import Input from '../Input'
import formatNum from '../../data/formatNum'
import { CONFLUXSCAN_TX, CUSTODIAN_CONTRACT_ADDR } from '../../config/config'

export default function ShuttleOut({ location: { search }, match: { url } }) {
  const [commonCx, buttonCx, modalCx, shuttleCx, shuttleOutCx] = useStyle(
    inputStyles,
    buttonStyles,
    modalStyles,
    shuttleStyle,
    shuttleOutStyles
  )
  const { t } = useTranslation('shuttle-out')
  const { token, ...extra } = parseSearch(search)
  const { tokens } = useTokenList(token)
  const tokenInfo = tokens && token ? tokens[0] : null

  const [errorPopup, setErrorPopup] = useState(false)
  const [successPopup, setSuccessPopup] = useState(false)
  const [addrPopup, setAddrPopup] = useState(false)
  const [feePopup, setFeePopup] = useState(false)
  const [ctokenPopup, setCTokenPopup] = useState(false)

  const { burn } = useCToken(
    tokenInfo ? tokenInfo.ctoken : '',
    CUSTODIAN_CONTRACT_ADDR
  )

  const {
    balances: [, [_balance]],
  } = useConfluxPortal(tokenInfo ? [tokenInfo.ctoken] : undefined)
  let balance
  if (_balance && tokenInfo) {
    console.log(_balance.toString())
    balance = formatNum(_balance, tokenInfo.decimals)
  }
  //to do fake a balance
  balance = 12.12344567889
  const schema = yup.object().shape({
    outamount: yup
      .number()
      .typeError(t('error.number'))
      .min(
        tokenInfo ? tokenInfo.minimal_burn_value : 0,
        t('error.min', tokenInfo)
      )
      .max(balance, t('error.insufficient')),
    outaddress: yup
      .string()
      .required(t('error.required'))
      .matches(/^0x[0-9a-fA-F]{40}$/, t('error.invalid-address')),
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
    const { outaddress, outamount } = data
    console.log('outamount', outamount)
    burn(outamount, outaddress)
      .then((e) => {
        console.log(e)
        tx.current = e
        setSuccessPopup(true)
      })
      .catch((e) => {
        setErrorPopup(true)
      })
  }

  if (token && !tokenInfo) {
    return null //the token info is loading
  }

  return (
    <div className={shuttleCx('root')}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* token */}
        <Input
          icon={tokenInfo?.icon}
          defaultValue={tokenInfo?.symbol}
          placeholder={t('placeholder.out')}
          to={{
            pathname: '/token',
            search: buildSearch({ next: url, cToken: 1, ...getValues() }),
          }}
          tokenInfo={tokenInfo}
          cToken={() => setCTokenPopup(true)}
        />

        <div className={shuttleCx('down')}>
          <img alt="down" src={down}></img>
        </div>

        {/* conflux token */}
        <Input
          icon={tokenInfo?.icon}
          defaultValue={tokenInfo?.reference_symbol}
          placeholder={t('placeholder.in')}
          to={{
            pathname: '/token',
            search: buildSearch({
              next: url,
              ...getValues(),
            }),
          }}
          tokenInfo={tokenInfo}
        />

        {/* shuttle out amount */}
        <label className={shuttleOutCx('amount-container')}>
          <div>
            <span className={shuttleCx('title')}>{t('amount')} </span>
          </div>

          <div className={shuttleOutCx('amount-input')}>
            <Input
              value={watch('outamount')}
              name="outamount"
              ref={register}
              error={errors.outamount}
              onChange={(e) => {
                let value = e.target.value
                let [p1, p2] = value.split('.')
                if (p2) {
                  p2 = p2.slice(0, 6)
                  value = [p1, p2].join('.')
                }
                e.target.value = value
              }}
              placeholder={
                !tokenInfo
                  ? t('placeholder.input-amount')
                  : t('balance', {
                      amount: balance,
                      cSymbol: tokenInfo.reference_symbol,
                    })
              }
            />
            <div
              onClick={() => {
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
            <span className={shuttleCx('with-question')}>
              <span>{t('fee', tokenInfo)}</span>
              <img
                alt="?"
                onClick={() => setFeePopup(true)}
                src={question}
              ></img>
            </span>
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
                  {message}
                </span>
              )
            }}
          />
        </div>

        {/* shuttle out address */}
        <div className={shuttleOutCx('address-container')}>
          <div className={shuttleCx('title', 'with-question')}>
            <span>{t('address')}</span>
            <img
              alt="?"
              onClick={(e) => {
                setAddrPopup(true)
              }}
              src={question}
            ></img>
          </div>
          <div className={shuttleOutCx('address-input')}>
            <Input
              value={watch('outaddress')}
              style={{ fontWeight: 'lighter' }}
              ref={register}
              name="outaddress"
              placeholder={t('placeholder.address')}
            />
            <img
              style={{ display: !!getValues().outaddress ? 'block' : 'none' }}
              onClick={() => setValue('outaddress', '')}
              src={clear}
              alt="clear"
              className={commonCx('clear')}
            ></img>
          </div>
        </div>

        <ErrorMessage
          errors={errors}
          name="outaddress"
          render={({ message }) => {
            return (
              <p
                style={{ color: '#F3504F' }}
                className={shuttleCx('small-text')}
              >
                {message}
              </p>
            )
          }}
        />

        <input
          disabled={!tokenInfo}
          type="submit"
          value={t('shuttle-out')}
          className={buttonCx('btn') + ' ' + shuttleOutCx('btn')}
        />
      </form>
      <ShuttleHistory type="burn" />
      <Modal show={errorPopup} clickAway={() => setErrorPopup(false)}>
        <img alt="img" className={shuttleOutCx('img')} src={fail}></img>
        <div className={modalCx('strong')}>{t('popup.fail')}</div>
        <div className={modalCx('btn')} onClick={() => setErrorPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={successPopup} clickAway={() => setSuccessPopup(false)}>
        <img alt="img" className={shuttleOutCx('img')} src={sent}></img>
        <div className={modalCx('strong')}>{t('popup.sent')}</div>
        <div
          className={modalCx('btn')}
          onClick={() => {
            setSuccessPopup(false)
            window.open(CONFLUXSCAN_TX + tx.current, '_blank')
          }}
        >
          {t('popup.details')}
        </div>
      </Modal>
      <Modal show={addrPopup} clickAway={() => setAddrPopup(false)}>
        <div className={modalCx('title')}>{t('popup.title')}</div>
        <div className={modalCx('content')}>{t('popup.address')}</div>
        <div className={modalCx('btn')} onClick={() => setAddrPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={feePopup} clickAway={() => setFeePopup(false)}>
        <div className={modalCx('title')}>{t('popup.title')}</div>
        <div className={modalCx('content')}>{t('popup.fee')}</div>
        <div className={modalCx('btn')} onClick={() => setFeePopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={ctokenPopup} clickAway={() => setCTokenPopup(false)}>
        <div className={modalCx('title')}>{t('popup.title')}</div>
        <div className={modalCx('content')}>{t('popup.ctoken')}</div>
        <div className={modalCx('btn')} onClick={() => setCTokenPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
    </div>
  )
}

//admin　sponser
