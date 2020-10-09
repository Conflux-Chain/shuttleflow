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
          alt='icon'
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
          <img alt='arrow' className={shuttleCx('arrow')} src={arrow}></img>
        </Link>
      </div>
      <div className={shuttleCx('down')}>
        <img alt='down' src={down}></img>
      </div>
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
        <Link
          to={{
            pathname: '/token',
            search: `?next=${url}&cToken=1`,
          }}
        >
          <img alt='arrow' className={shuttleCx('arrow')} src={arrow}></img>
        </Link>
      </div>

      {tokenInfo && <p
        className={shuttleInCx('small-text') + ' ' + shuttleCx('small-text')}>
        <span>{t('txt.shuttle-in-amount', { amount: tokenInfo.inMin, token: tokenInfo.symbol })}</span>
        <span style={{ display: 'flex' }}>
          <span>{t('txt.shuttle-in-fee', { amount: tokenInfo.inFee, ctoken: tokenInfo.cSymbol })}</span>
          <img alt='?' src={question}></img>
        </span>

      </p>}

      <label className={shuttleInCx('address')}>
        <div className={shuttleCx('title', 'with-question')}>
          <span>{t('txt.shuttle-in-address')}</span>
          <img alt='?' src={question}></img>
        </div>

        <div className={shuttleInCx('address-input')}>
          <input
            readOnly
            defaultValue={address}
            className={commonCx('input-common')}
            placeholder={t('placeholder.shuttle-in-address')}
          />
          <img alt='copy' className={shuttleInCx('copy')} src={copy}></img>
        </div>
      </label>
      <p
        className={shuttleCx('small-text')}>
        <span>{t('txt.latest-address-please')}</span>
        <span style={{ display: 'flex' }}>
          <span>{t('txt.qrcode')}</span>
        </span>
      </p>
    </div>
  )
}
