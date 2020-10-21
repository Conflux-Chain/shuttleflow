import React, { useState } from 'react'
import HistoryItem from './HistoryItem'
import historyStyles from './history.module.scss'
import useStyle from '../component/useStyle'
import Accordion from '../component/Accordion'
import { useTranslation } from 'react-i18next'
import useHistory from '../data/useHistory'
import notFound from '../component/not-found.png'
import Histories from './Histories'
import open from './down.svg'

const FILTERS = [
  ['all', ['doing', 'finished']],
  ['success', ['finished']],
  ['pending', ['doing']],
]

export default function History() {
  const [cx] = useStyle(historyStyles)
  const { t } = useTranslation('history')
  const [expanded, setExpanded] = useState(false)
  const [filter, setFilter] = useState(0)

  const { data: histories, loading } = useHistory({
    status: FILTERS[filter][1],
  })
  console.log(histories)
  return (
    <div className={cx('history-container')}>
      <div className={cx('select')}>
        <Accordion
          expanded={expanded}
          title={
            <div
              onClick={() => setExpanded((x) => !x)}
              className={cx('filter-container')}
            >
              <div className={cx('select-item', 'filter-txt')}>
                {t(FILTERS[filter][0])}
              </div>
              <img
                alt="open"
                className={cx('down', { expanded })}
                src={open}
              ></img>
            </div>
          }
          content={
            <div className={cx('select-content')}>
              {FILTERS.map((_, i) => (
                <div
                  onClick={() => {
                    setExpanded(false)
                    setFilter(i)
                  }}
                  key={i}
                  className={cx('select-item', 'hover', {
                    active: i === filter,
                  })}
                >
                  {t(FILTERS[i][0])}
                </div>
              ))}
            </div>
          }
        />
      </div>
      {loading ? null : (
        <div className={cx('history-items')}>
          {histories.length > 0 ? (
            <Histories histories={histories} />
          ) : (
            <img
              style={{ display: 'block', margin: 'auto' }}
              alt="not found"
              src={notFound}
            />
          )}
        </div>
      )}
    </div>
  )
}
