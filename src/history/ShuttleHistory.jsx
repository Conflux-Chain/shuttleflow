import React from 'react'
import { useHistory } from 'react-router-dom'
import useStyle from '../component/useStyle'
import HistoryItem from './HistoryItem'
import styles from './ShuttleHistory.module.scss'
import rightArrow from './right-arrow.svg'
import sync from './sync.svg'
import histories from '../data/mock/historyDB'
import { useTranslation } from 'react-i18next'
import useHistories from '../data/useHistory'
import { useConfluxPortal } from '@cfxjs/react-hooks'

export default function ShuttleHistory() {
  const { t } = useTranslation('common', 'history')
  const { address } = useConfluxPortal()

  const history = useHistory()
  const { data: histories, reload, loading } = useHistories({
    status: ['doing'],
    limit: 3,
    address,
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
            onClick={() => history.push('/history')}
            className={cx('small-txt')}
          >
            {t('more')}
          </div>
          <img alt="more" className={cx('more')} src={rightArrow}></img>
        </div>
      </div>
      {histories.slice(0, 3).map((props, i) => (
        <HistoryItem {...props} key={i} />
      ))}
    </div>
  ) : null
}
