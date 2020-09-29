import React from 'react'

import { useTranslation } from 'react-i18next'

import inputStyles from '../../component/input.module.scss'
import buttonStyles from '../../component/button.module.scss'
import shuttleInput from '../Shuttle.module.scss'
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


const __mock_balance = 100
export default function ShuttleOut({ location: { search }, match: { url }, history }) {
  const [commonCx, buttonCx, shuttleCx] = useStyle(
    inputStyles,
    buttonStyles,
    shuttleInput,
  )
  const { t } = useTranslation()
  const { token, ...extra } = parseSearch(search)
  const { data: tokenInfo } = useSWR(token ? ['/address', token] : null, swrSearchTokenFetcher)


  const schema = yup.object().shape({
    outamount: yup
      .number()
      .transform(value => (isNaN(value) ? undefined : value))
      .required(t('errors.required'))
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

  return (
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
      <label>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span className={shuttleCx('title')}>{t('txt.out-amount')} </span>
          {tokenInfo && <span className={shuttleCx('small-text')}>
            <span>
              {t('txt.shuttle-out-fee', tokenInfo)}
            </span>
            <img src={question}></img></span>}

        </div>

        <input
          ref={register}
          name='outamount'
          placeholder={!tokenInfo ? t('placeholder.input-amount') : t('placeholder.shuttle-out-amount', tokenInfo)}
          autoComplete='off'
          className={commonCx('input-common', errors.outamount ? 'error' : '')}
        />
      </label>

      <ErrorMessage
        errors={errors}
        name="outamount"
        render={({ message }) => {
          return <p>{message}</p>
        }}
      />



      {/* shuttle out address */}
      <label>
        <div className={shuttleCx('title')}>
          <span>{t('txt.out-address')}</span>
        </div>
        <input
          ref={register}
          name='outaddress'
          autoComplete='off'
          placeholder={t('placeholder.input-address')}
          className={commonCx('input-common', errors.outaddress ? 'error' : '')}
        />
      </label>

      <ErrorMessage
        errors={errors}
        name="outaddress"
        render={({ message }) => {
          return <p>{message}</p>
        }}
      />

      <input
        disabled={!tokenInfo}
        type='submit'
        style={{ width: '90%' }}
        className={buttonCx('btn')} />


    </form>
  )
}




//admin　sponser