import React, { useState } from 'react'
import historyStyles from './history.module.scss'
import useStyle from '../component/useStyle'
import Accordion from '../component/Accordion'
import { useTranslation } from 'react-i18next'
import useUserHistory from '../data/useHistory'
import { useHistory } from 'react-router-dom'
import notFound from '../component/not-found.png'
import Histories from './Histories'
import open from './down.svg'
import { parseSearch } from '../component/urlSearch'

const FILTERS = [
  ['all', ['doing', 'finished']],
  ['success', ['finished']],
  ['pending', ['doing']],
]

export default function History({ location: { search } }) {
  const [cx] = useStyle(historyStyles)
  const { t } = useTranslation(['history', 'nav'])
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [filter, setFilter] = useState(0)
  const { type = 'mint' } = parseSearch(search)
  const history = useHistory()
  console.log('tab', type)

  const { data: histories, loading } = useUserHistory({
    status: FILTERS[filter][1],
    type,
  })
  return (
    <div className={cx('history-container')}>
      <div className={cx('tab-container')}>
        <div
          className={cx('tab', { 'active-tab': type === 'mint' })}
          onClick={() =>
            history.push({
              search: '?type=mint',
            })
          }
        >
          {t('nav:shuttle-in')}
        </div>
        <div
          className={cx('tab', { 'active-tab': type === 'burn' })}
          onClick={() =>
            history.push({
              search: '?type=burn',
            })
          }
        >
          {t('nav:shuttle-out')}
        </div>
      </div>
      <div className={cx('select')}>
        <Accordion
          expanded={filterExpanded}
          title={
            <div
              onClick={() => setFilterExpanded((x) => !x)}
              className={cx('filter-container')}
            >
              <div className={cx('select-item', 'filter-txt')}>
                {t(FILTERS[filter][0])}
              </div>
              <img
                alt="open"
                className={cx('down', { expanded: filterExpanded })}
                src={open}
              ></img>
            </div>
          }
          content={
            <div className={cx('select-content')}>
              {FILTERS.map((_, i) => (
                <div
                  onClick={() => {
                    setFilterExpanded(false)
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
