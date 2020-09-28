import React from 'react'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'

import arrow from '../arrow.svg'
import down from '../down.svg'
import copy from './copy.svg'
import question from '../../component/question.svg'

import useStyle from '../../component/useStyle'
import commonInputStyles from '../../component/input.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'
import useShuttleInAddress from '../../data/useShuttleInAddress'
import swrSearchTokenFetcher from '../../data/mock/swrSearchTokenFetcher'



export default function ShuttleIn({ location: { search }, match: { url } }) {
  const [commonCx, shuttleCx, shuttleInCx] = useStyle(
    commonInputStyles,
    shuttleStyle,
    shuttleInStyles
  )
  const token = new URLSearchParams(search).get('token')
  const { t } = useTranslation()
  const address = useShuttleInAddress(token, 'accountAddress')

  const { data: tokenInfo } = useSWR(token ? ['/address', token] : null, swrSearchTokenFetcher)

  return (
    <div className={shuttleInCx('container')}>
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
        <Link
          to={{
            pathname: '/token',
            search: `?next=${url}`,
          }}
        >
          <img className={shuttleCx('arrow')} src={arrow}></img>
        </Link>
      </div>
      <div className={shuttleCx('down')}>
        <img src={down}></img>
      </div>
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
        <Link
          to={{
            pathname: '/token',
            search: `?next=${url}&cToken=1`,
          }}
        >
          <img className={shuttleCx('arrow')} src={arrow}></img>
        </Link>
      </div>

      {tokenInfo && <div
        className={shuttleInCx('small-text') + ' ' + shuttleCx('small-text')}>
        <span>{t('sentence.shuttle-in-amount', { amount: tokenInfo.inMin, token: tokenInfo.symbol })}</span>
        <span style={{ display: 'flex' }}>
          <span>{t('sentence.shuttle-in-fee', { amount: tokenInfo.inFee, ctoken: tokenInfo.cSymbol })}</span>
          <img src={question}></img>
        </span>

      </div>}


      <div className={shuttleCx('title')}>
        <span>{t('sentence.shuttle-in-address')}</span>
        <img src={question}></img>
      </div>

      <div className={shuttleCx('input-arrow')}>
        <input
          readOnly
          defaultValue={address}
          className={commonCx('input-common')}
          placeholder={t('placeholder.shuttle-in-address')}
        />
        <img className={shuttleCx('arrow')} style={{ width: '2rem' }} src={copy}></img>
      </div>

      <div
        className={shuttleInCx('small-text') + ' ' + shuttleCx('small-text')}>
        <span>{t('sentence.latest-address-please')}</span>
        <span style={{ display: 'flex' }}>
          <span>{t('sentence.qrcode')}</span>
          {/* <img src={question}></img> */}
        </span>
      </div>
    </div>
  )
}
