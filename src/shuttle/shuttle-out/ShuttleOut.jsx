import React from 'react'

import { useTranslation } from 'react-i18next'

import inputStyles from '../../component/input.module.scss'
import buttonStyles from '../../component/button.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleOutStyles from './ShuttleOut.module.scss'

import useStyle from '../../component/useStyle'
import swrSearchTokenFetcher from '../../data/mock/swrSearchTokenFetcher'
import { useForm } from "react-hook-form";
import useSWR from 'swr'
import arrow from '../arrow.svg'
import down from '../down.svg'
import question from '../../component/question.svg'

import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { ErrorMessage } from "@hookform/error-message";
import { buildSearch, parseSearch } from '../../component/urlSearch'
import History from '../../history/History'


const __mock_balance = 100
export default function ShuttleOut({ location: { search }, match: { url }, history }) {
  const [commonCx, buttonCx, shuttleCx, shuttleOutCx] = useStyle(
    inputStyles,
    buttonStyles,
    shuttleStyle,
    shuttleOutStyles
  )

  const { t } = useTranslation()
  const { token, ...extra } = parseSearch(search)
  const { data: tokenInfo } = useSWR(token ? ['/address', token] : null, swrSearchTokenFetcher)


  const schema = yup.object().shape({
    outamount: yup
      .number()
      .typeError(t('errors.number'))
      .moreThan(tokenInfo ? tokenInfo.outMin : 0, t('errors.min', tokenInfo))
      .lessThan(__mock_balance, t('errors.insufficient')),
    outaddress: yup
      .string()
      .required(t('errors.required'))
      .matches(/^0x[0-9a-fA-F]{40}$/, t('errors.invalid-address'))
  });




  const { register, handleSubmit, getValues, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: extra,
    mode: 'onBlur'
  });
  const onSubmit = data => console.log(data);

  console.log(errors)

  console.log(token, tokenInfo)
  if (token && !tokenInfo) {
    return null //the token info is loading
  }

  return (<div className={shuttleCx('root')}>
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* token */}
      <div className={shuttleCx('input-arrow', { 'with-icon': !!tokenInfo })}>
        {tokenInfo && <img
          className={shuttleCx('icon')}
          src={tokenInfo.icon}
        ></img>}
        <input
          readOnly
          className={commonCx('input-common')}
          defaultValue={tokenInfo?.symbol}
          placeholder={t('placeholder.token-in')}
        />
        <img
          onClick={() => {
            history.push({
              pathname: '/token',
              search: buildSearch({ next: url, ...getValues() }),
            })
          }}
          className={shuttleCx('arrow')} src={arrow}></img>
      </div>


      <div className={shuttleCx('down')}>
        <img src={down}></img>
      </div>


      {/* conflux token */}
      <div className={shuttleCx('input-arrow', { 'with-icon': !!tokenInfo })}>
        {tokenInfo && <img
          className={shuttleCx('icon')}
          src={tokenInfo.icon}
        ></img>}
        <input
          readOnly
          className={commonCx('input-common')}
          defaultValue={tokenInfo?.cSymbol}
          placeholder={t('placeholder.ctoken-in')}
        />
        <img
          onClick={() => {
            history.push({
              pathname: '/token',
              search: buildSearch({
                next: url, cToken: 1,
                ...getValues()
              }),
            })
          }}
          className={shuttleCx('arrow')} src={arrow}></img>
      </div>


      {/* shuttle out amount */}
      <label className={shuttleOutCx('amount-container')}>
        <div className={shuttleCx('small-text')}>
          <span className={shuttleCx('title')}>{t('txt.out-amount')} </span>
          {tokenInfo && <span className={shuttleCx('small-text')}>
            <span>
              {t('txt.shuttle-out-fee', tokenInfo)}
            </span>
            <img src={question}></img>
          </span>}

        </div>

        <input
          ref={register}
          name='outamount'
          placeholder={!tokenInfo ? t('placeholder.input-amount') : t('placeholder.shuttle-out-amount', tokenInfo)}
          autoComplete='off'
          className={
            commonCx('input-common', errors.outamount ? 'error' : '') + ' ' +
            shuttleOutCx('amount-input')
          }
        />
      </label>

      <p
        className={shuttleCx('small-text')}
        style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* the dom element should exist ensuring the other txt flush to right */}
        <div>
          <ErrorMessage
            errors={errors}
            name="outamount"
            render={({ message }) => {
              return <span style={{ color: '#F3504F' }} className={shuttleCx('small-text')}>{message}</span>
            }}
          />
        </div>

        <span >{tokenInfo && t('txt.out-balance', { amount: __mock_balance, cSymbol: tokenInfo.cSymbol })}</span>
      </p>




      {/* shuttle out address */}
      <label className={shuttleOutCx('address-container')}>
        <div className={shuttleCx('title')}>
          <span>{t('txt.out-address')}</span>
          <img src={question}></img>
        </div>
        <input
          ref={register}
          name='outaddress'
          autoComplete='off'
          placeholder={t('placeholder.input-address')}
          className={commonCx('input-common', errors.outaddress ? 'error' : '') + ' ' +
            shuttleOutCx('address-input')
          }
        />
      </label>

      <ErrorMessage
        errors={errors}
        name="outaddress"
        render={({ message }) => {
          return <p style={{ color: '#F3504F' }} className={shuttleCx('small-text')}>{message}</p>
        }}
      />

      <input
        disabled={!tokenInfo}
        type='submit'
        style={{ width: '90%' }}
        className={buttonCx('btn') + ' ' + shuttleOutCx('btn')} />

    </form>
    <History />
  </div>
  )
}




//admin　sponser