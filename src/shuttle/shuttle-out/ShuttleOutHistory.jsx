import React from 'react'
import { useHistory } from 'react-router-dom'
import useStyle from '../../component/useStyle'
import HistoryItem from '../../history/HistoryItem'
import styles from './ShuttleOutHistory.module.scss'
import rightArrow from './right-arrow.svg'
import sync from './sync.svg'
import { useTranslation } from 'react-i18next'

export default function ShuttleOutHistory() {
    const { t } = useTranslation()
    const history = useHistory()

    const [cx] = useStyle(styles)
    return <div>
        <div className={cx('txt-container')}>
            <div className={cx('left')}>
                <div className={cx('large-txt')}>{t('txt.history')}</div>
                <img className={cx('sync', 'loading')} src={sync}></img>
            </div>
            <div className={cx('right')}>
                <div
                    onClick={() => history.push('/history')}
                    className={cx('small-txt')}>{t('btn.see-more')}</div>
                <img className={cx('more')} src={rightArrow}></img>
            </div>

        </div>
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
    </div>
}