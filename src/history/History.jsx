import React, { useState } from 'react'
import HistoryItem from './HistoryItem'
import historyStyles from './history.module.scss'
import useStyle from '../component/useStyle'
import Accordion from '../component/Accordion'
import { useTranslation } from 'react-i18next'
import histories from '../data/mock/historyDB'

const FILTERS = ['all', 'success', 'pending']

export default function History() {
  const [cx] = useStyle(historyStyles)
  const { t } = useTranslation('history')
  const [expanded, setExpanded] = useState(false)
  const [current, setCurrent] = useState(FILTERS[0])
  return (
    <div className={cx('history-container')}>
      <div className={cx('select')}>
        <Accordion
          expanded={expanded}
          title={
            <div
              className={cx('select-item')}
              onClick={() => setExpanded((x) => !x)}
            >
              {t(current)}
            </div>
          }
          content={
            <div className={cx('select-content')}>
              {FILTERS.map((status) => (
                <div
                  onClick={() => {
                    setExpanded(false)
                    setCurrent(status)
                  }}
                  key={status}
                  className={cx('select-item', 'hover', {
                    active: status === current,
                  })}
                >
                  {t(status)}
                </div>
              ))}
            </div>
          }
        />
      </div>
      <div className={cx('history-items')}>
        {histories.map((props) => {
          return <HistoryItem {...props} />
        })}
      </div>
    </div>
  )
}
