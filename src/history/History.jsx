import React, { useState } from 'react'
import HistoryItem from './HistoryItem'
import historyStyles from './history.module.scss'
import useStyle from '../component/useStyle'
import Accordion from '../component/Accordion'
import { useTranslation } from 'react-i18next'
import useHistory from '../data/useHistory'
import { useConfluxPortal } from '@cfxjs/react-hooks'

const FILTERS = [
  ['all', ['doing', 'finished']],
  ['success', ['finished']],
  ['pending', ['doing']],
]

export default function History() {
  const [cx] = useStyle(historyStyles)
  const { t } = useTranslation('history')
  const { address } = useConfluxPortal()
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState(0)
  const { data: histories } = useHistory({
    status: FILTERS[filter][1],
    // address,
  })
  console.log(histories)
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
              {t(FILTERS[filter][0])}
            </div>
          }
          content={
            <div className={cx('select-content')}>
              {FILTERS.map((status, i) => (
                <div
                  onClick={() => {
                    setExpanded(false)
                    setFilter(i)
                  }}
                  key={i}
                  className={cx('select-item', 'hover', {
                    active: status === filter,
                  })}
                >
                  {t(FILTERS[i][0])}
                </div>
              ))}
            </div>
          }
        />
      </div>
      <div className={cx('history-items')}>
        {histories.map((props, i) => {
          return <HistoryItem key={i} {...props} />
        })}
      </div>
    </div>
  )
}
