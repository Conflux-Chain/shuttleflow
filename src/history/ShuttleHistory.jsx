import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useStyle from '../component/useStyle'
import styles from './ShuttleHistory.module.scss'
import rightArrow from './right-arrow.svg'
import sync from './sync.svg'
import { useTranslation } from 'react-i18next'
import useOperationHistory from '../data/useOperationHistory'
import Histories from './Histories'

export default function ShuttleHistory({ type }) {
  const { t } = useTranslation('common', 'history')
  const { chain } = useParams()
  const history = useHistory()
  const { data: histories, reload, loading } = useOperationHistory({
    status: ['doing'],
    limit: 3,
    type,
  })
  const [cx] = useStyle(styles)
  return histories.length > 0 ? (
    <div>
      <div className={cx('txt-container')}>
        <div className={cx('left')}>
          <div className={cx('large-txt')}>{t('history')}</div>
          <img
            alt="loading"
            className={cx('sync', { loading })}
            onClick={loading ? null : reload}
            src={sync}
          ></img>
        </div>
        <div className={cx('right')}>
          <div
            onClick={() => history.push(`/${chain}/history`)}
            className={cx('small-txt')}
          >
            {t('more')}
          </div>
          <img alt="more" className={cx('more')} src={rightArrow}></img>
        </div>
      </div>
      <Histories histories={histories} />
    </div>
  ) : null
}
