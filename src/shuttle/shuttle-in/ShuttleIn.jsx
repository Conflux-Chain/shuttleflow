import React from 'react'

import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import arrow from '../arrow.svg'
import down from '../down.svg'
import question from '../../component/question.svg'

import useStyle from '../../component/useStyle'
import commonInputStyles from '../../component/input.module.scss'
import shuttleInput from '../input.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'
import useShuttleInAddress from '../../data/useShuttleInAddress'

export default function ShuttleIn({ location: { search }, match: { url } }) {
  const [commonCx, shuttleCx, shuttleInCx] = useStyle(
    commonInputStyles,
    shuttleInput,
    shuttleInStyles
  )
  const token = new URLSearchParams(search).get('token')
  const { t } = useTranslation()
  const address = useShuttleInAddress(token, 'accountAddress')

  return (
    <div className={shuttleInCx('container')}>
      <div className={shuttleCx('input-arrow', 'with-icon')}>
        <img
          className={shuttleCx('icon')}
          src={'https://via.placeholder.com/50'}
        ></img>
        <input
          readOnly
          className={commonCx('input-common')}
          defaultValue={token || ''}
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
      <div className={shuttleInCx('down')}>
        <img src={down}></img>
      </div>
      <div className={shuttleCx('input-arrow', 'with-icon')}>
        <img
          className={shuttleCx('icon')}
          src={'https://via.placeholder.com/50'}
        ></img>
        <input
          readOnly
          className={commonCx('input-common')}
          defaultValue={token || ''}
          defaultValue={!token ? '' : 'c' + token}
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
      <div className={shuttleInCx('title')}>
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
      </div>
    </div>
  )
}
