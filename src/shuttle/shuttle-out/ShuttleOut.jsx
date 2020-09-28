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

import { buildSearch, parseSearch } from '../../component/urlSearch'

export default function ShuttleOut({ location: { search }, match: { url }, history }) {
  const { token,outaddress,outamount } = parseSearch(search)
  const [commonCx, buttonCx, shuttleCx] = useStyle(
    inputStyles,
    buttonStyles,
    shuttleInput,
  )
  const { data: tokenInfo } = useSWR(token ? ['/address', token] : null, swrSearchTokenFetcher)
  const { t } = useTranslation()

  const { register, handleSubmit, getValues } = useForm();
  const onSubmit = data => console.log(data);


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
          <span className={shuttleCx('title')}>{t('sentence.out-amount')} <img src={question}></img></span>
          {tokenInfo && <span className={shuttleCx('small-text')}>{t('sentence.shuttle-out-fee')}</span>}

        </div>

        <input
          ref={register}
          name='outamount'
          defaultValue={outamount}
          placeholder={t('placeholder.input-amount')}
          autoComplete='off'
          className={commonCx('input-common')}
        />
      </label>



      {/* shuttle out address */}
      <label>
        <div className={shuttleCx('title')}>
          <span>{t('sentence.out-address')}</span>
        </div>
        <input
          ref={register}
          defaultValue={outaddress}
          name='outaddress'
          autoComplete='off'
          placeholder={t('placeholder.input-address')}
          className={commonCx('input-common')}
        />
      </label>
      <input
        disabled={!tokenInfo}
        type='submit'
        style={{ width: '90%' }}
        className={buttonCx('btn')} />
    </form>
  )
}


