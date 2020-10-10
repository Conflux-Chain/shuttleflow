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
import clear from '../../component/clear.svg'
import ShuttleHistory from '../../history/ShuttleHistory'


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
      .min(tokenInfo ? tokenInfo.outMin : 0, t('errors.min', tokenInfo))
      .max(__mock_balance, t('errors.insufficient')),
    outaddress: yup
      .string()
      .required(t('errors.required'))
      .matches(/^0x[0-9a-fA-F]{40}$/, t('errors.invalid-address'))
  });




  const { register, handleSubmit, getValues, setValue, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: extra,
    mode: 'onBlur'
  });
  const onSubmit = data => console.log(data);

  if (token && !tokenInfo) {
    return null //the token info is loading
  }

  return (<div className={shuttleCx('root')}>
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* token */}
      <div className={shuttleCx('input-arrow', { 'with-icon': !!tokenInfo })}>
        {tokenInfo && <img
          className={shuttleCx('icon')}
          alt='icon'
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
          alt='arrow'
          className={shuttleCx('arrow')} src={arrow}></img>
      </div>


      <div className={shuttleCx('down')}>
        <img alt='down' src={down}></img>
      </div>


      {/* conflux token */}
      <div className={shuttleCx('input-arrow', { 'with-icon': !!tokenInfo })}>
        {tokenInfo && <img
          alt='icon'
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
          alt='token'
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
        <div>
          <span className={shuttleCx('title')}>{t('txt.out-amount')} </span>
        </div>

        <div className={shuttleOutCx('amount-input')}>
          <input
            ref={register}
            name='outamount'
            placeholder={!tokenInfo ? t('placeholder.input-amount') :
              t('txt.out-balance', { amount: __mock_balance, cSymbol: tokenInfo.cSymbol })
            }
            autoComplete='off'
            className={
              commonCx('input-common', errors.outamount ? 'error' : '')
            }
          />
          <div
            onClick={() => {
              setValue('outamount', __mock_balance)
            }}
            className={shuttleOutCx('all') + ' ' + shuttleCx('small-text')}>
            {t('btn.all')}
          </div>
        </div>


      </label>

      {
        tokenInfo && <div
          className={shuttleCx('small-text')}>
          <span> {t('placeholder.shuttle-out-amount', tokenInfo)}</span>
          <span className={shuttleCx('with-question')}>
            <span>
              {t('txt.shuttle-out-fee', tokenInfo)}
            </span>
            <img alt='?' src={question}></img>
          </span>
        </div>
      }

      <div>
        <ErrorMessage
          errors={errors}
          name="outamount"
          render={({ message }) => {
            return <span className={shuttleCx('small-text')} style={{ color: '#F3504F' }}>{message}</span>
          }}
        />
      </div>


      {/* shuttle out address */}
      <label className={shuttleOutCx('address-container')}>
        <div className={shuttleCx('title', 'with-question')}>
          <span>{t('txt.out-address')}</span>
          <img alt='?' src={question}></img>
        </div>
        <div className={shuttleOutCx('address-input')}>
          <input
            data-lpignore="true"
            ref={register}
            name='outaddress'
            autoComplete='off'
            placeholder={t('placeholder.input-address')}
            className={commonCx('input-common', errors.outaddress ? 'error' : '')
            }
          />

          <img
            style={{ display: !!getValues().outaddress ? 'block' : 'none' }}
            onClick={() => setValue('outaddress', '')}
            src={clear} alt='clear' className={commonCx('clear')}></img>
        </div>


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
        value={t('btn.shuttle-out')}
        className={buttonCx('btn') + ' ' + shuttleOutCx('btn')} />
    </form>

    <ShuttleHistory />
  </div>
  )
}




//admin　sponser