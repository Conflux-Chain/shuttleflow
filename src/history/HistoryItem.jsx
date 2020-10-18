import React, { useState } from 'react'
import Accordion from '../component/Accordion'
import useStyle from '../component/useStyle'
import itemStyle from './historyItem.module.scss'
import open from './open.svg'
import { useTranslation } from 'react-i18next'

const STEPS = {
  mint: ['init', 'main', 'shuttle', 'conflux'],
  burn: ['init', 'conflux', 'shuttle', 'main'],
}

export default function HistoryItem(props) {
  // props = historyItem
  const { token, amount, step, type, icon } = props
  const steps = STEPS[type]
  console.log(props)
  const [expanded, setExpanded] = useState(false)
  const [cx] = useStyle(itemStyle)
  const { t } = useTranslation('history')
  return (
    <Accordion
      title={
        <div className={cx('title-container')}>
          <div className={cx('title')}>
            <div className={cx('start')}>
              <img alt="icon" className={cx('img')} src={icon}></img>
              <div className={cx('two-row')}>
                <div
                  style={{ fontWeight: 500, color: 'white' }}
                  className={cx('large-txt')}
                >
                  {token}
                </div>
                <div style={{ color: '#AEB0C2' }} className={cx('small-txt')}>
                  {t(steps[step])}
                </div>
              </div>
            </div>
            <div className={cx('two-row', 'end')}>
              <div style={{ fontWeight: 'bold' }} className={cx('large-txt')}>
                {amount}
              </div>
              <div className={cx('small-txt')}>
                {t(step === 3 ? 'success' : 'pending')}
              </div>
            </div>
          </div>
          <div
            style={{ visibility: expanded ? 'hidden' : 'visible' }}
            className={cx('arrow')}
            onClick={() => setExpanded((x) => !x)}
          >
            <img alt="icon" className={cx('semi-circle')} src={open}></img>
          </div>
        </div>
      }
      expanded={expanded}
      content={
        <div>
          {STEPS[type].map((s, i) => {
            return (
              <div key={s} className={cx('item-container')}>
                <div className={cx('bar-container')}>
                  <div className={cx('bar', { complete: i <= step + 1 })}></div>
                  <div className={cx('bar', { complete: i <= step })}></div>
                  <div
                    className={cx('circle', { complete: i <= step + 1 })}
                  ></div>
                </div>
                <div className={cx('item')}>{t(s)}</div>
              </div>
            )
          })}
          <div
            className={cx('arrow')}
            style={{ transform: `rotate(180deg)` }}
            onClick={() => setExpanded((x) => !x)}
          >
            <img alt="icon" className={cx('semi-circle')} src={open}></img>
          </div>
        </div>
      }
    />
  )
}
