import React from 'react'

import { useTranslation } from 'react-i18next'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import useCToken from '@cfxjs/react-hooks/lib/useCToken'

import inputStyles from '../../component/input.module.scss'
import buttonStyles from '../../component/button.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleOutStyles from './ShuttleOut.module.scss'

import useStyle from '../../component/useStyle'
import { useForm } from 'react-hook-form'
import down from '../down.svg'
import question from '../../component/question.svg'

import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'
import { ErrorMessage } from '@hookform/error-message'
import { buildSearch, parseSearch } from '../../component/urlSearch'
import clear from '../../component/clear.svg'
import ShuttleHistory from '../../history/ShuttleHistory'
import useTokenList from '../../data/useTokenList'

import Input from '../Input'

// console.log(useCToken)
// const { useCToken } = shuttleflow

export default function ShuttleOut({ location: { search }, match: { url } }) {
  const [commonCx, buttonCx, shuttleCx, shuttleOutCx] = useStyle(
    inputStyles,
    buttonStyles,
    shuttleStyle,
    shuttleOutStyles
  )

  const { t } = useTranslation(['shuttle-out', 'common'])
  const { token, ...extra } = parseSearch(search)
  const { tokens } = useTokenList(token)

  const tokenInfo = tokens && token ? tokens[0] : null

  console.log(tokenInfo)

  const { burn } = useCToken(
    tokenInfo ? tokenInfo.ctoken : '',
    '0x82209899b1faa5f32ec80a7c7efb34aee7273d90'
  )

  const {
    balances: [, [_balance]],
  } = useConfluxPortal(token && [token])
  let balance
  if (_balance && tokenInfo) {
    console.log()
    balance = _balance / Math.pow(10, tokenInfo.decimals)
  }
  //to do fake a balance
  balance = 100
  const schema = yup.object().shape({
    outamount: yup
      .number()
      .typeError(t('errors.number'))
      .min(
        tokenInfo ? tokenInfo.minimal_burn_value : 0,
        t('errors.min', tokenInfo)
      )
      .max(balance, t('errors.insufficient')),
    outaddress: yup
      .string()
      .required(t('errors.required'))
      .matches(/^0x[0-9a-fA-F]{40}$/, t('errors.invalid-address')),
  })

  const { register, handleSubmit, getValues, setValue, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: extra,
    mode: 'onBlur',
  })
  const onSubmit = (data) => {
    console.log(data)
    const { outaddress, outamount } = data
    
    burn(outamount, outaddress)
      .then((e) => {
        console.log(e)
        alert(e)
      })
      .catch((e) => {
        console.log(e)
        alert(e)
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
          placeholder={t('common:placeholder.out')}
          to={{
            pathname: '/token',
            search: buildSearch({ next: url, cToken: 1, ...getValues() }),
          }}
          tokenInfo={tokenInfo}
          cToken={() => {}}
        />

        <div className={shuttleCx('down')}>
          <img alt="down" src={down}></img>
        </div>

        {/* conflux token */}
        <Input
          icon={tokenInfo?.icon}
          defaultValue={tokenInfo?.reference_symbol}
          placeholder={t('common:placeholder.in')}
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
            <input
              ref={register}
              name="outamount"
              placeholder={
                !tokenInfo
                  ? t('placeholder.input-amount')
                  : t('balance', {
                      amount: balance,
                      cSymbol: tokenInfo.reference_symbol,
                    })
              }
              autoComplete="off"
              className={commonCx(
                'input-common',
                errors.outamount ? 'error' : ''
              )}
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
              <img alt="?" src={question}></img>
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
        <label className={shuttleOutCx('address-container')}>
          <div className={shuttleCx('title', 'with-question')}>
            <span>{t('address')}</span>
            <img
              alt="?"
              onClick={(e) => {
                //disable input focus
                e.preventDefault()
              }}
              src={question}
            ></img>
          </div>
          <div className={shuttleOutCx('address-input')}>
            <input
              data-lpignore="true"
              ref={register}
              name="outaddress"
              autoComplete="off"
              placeholder={t('placeholder.address')}
              className={commonCx(
                'input-common',
                errors.outaddress ? 'error' : ''
              )}
            />

            <img
              style={{ display: !!getValues().outaddress ? 'block' : 'none' }}
              onClick={() => setValue('outaddress', '')}
              src={clear}
              alt="clear"
              className={commonCx('clear')}
            ></img>
          </div>
        </label>

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
          value={t('out')}
          className={buttonCx('btn') + ' ' + shuttleOutCx('btn')}
        />
      </form>

      <ShuttleHistory />
    </div>
  )
}

//admin　sponser
