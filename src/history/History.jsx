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
  const { t } = useTranslation('history')
  const [statusExpanded, setStatusExpanded] = useState(false)
  const [typeExpanded, setTypeExpanded] = useState(false)
  const [filter, setFilter] = useState(0)
  const { type = 'mint' } = parseSearch(search)
  const history = useHistory()

  const { data: histories, loading } = useUserHistory({
    status: FILTERS[filter][1],
    type,
  })
  return (
    <div className={cx('history-container')}>
      <div className={cx('select')}>
        <Accordion
          expanded={typeExpanded}
          contentStyle={{ position: 'absolute', left: 0, right: 0 }}
          title={
            <div
              onClick={() => setTypeExpanded((x) => !x)}
              className={cx('filter-container')}
            >
              <div className={cx('select-item', 'filter-txt')}>
                {t(type === 'mint' ? 'shuttle-in' : 'shuttle-out')}
              </div>
              <img
                alt="open"
                className={cx('down', { expanded: typeExpanded })}
                src={open}
              ></img>
            </div>
          }
          content={
            <div className={cx('select-content')}>
              {['mint', 'burn'].map((key) => (
                <div
                  onClick={() => {
                    setTypeExpanded(false)
                    history.push({
                      search: `?type=${key}`,
                    })
                  }}
                  key={key}
                  className={cx('select-item', 'hover', {
                    active: key === type,
                  })}
                >
                  {t(key === 'mint' ? 'shuttle-in' : 'shuttle-out')}
                </div>
              ))}
            </div>
          }
        />
        <Accordion
          expanded={statusExpanded}
          contentStyle={{ position: 'absolute', left: 0, right: 0 }}
          title={
            <div
              onClick={() => setStatusExpanded((x) => !x)}
              className={cx('filter-container')}
            >
              <div className={cx('select-item', 'filter-txt')}>
                {t(FILTERS[filter][0])}
              </div>
              <img
                alt="open"
                className={cx('down', { expanded: statusExpanded })}
                src={open}
              ></img>
            </div>
          }
          content={
            <div className={cx('select-content')}>
              {FILTERS.map((_, i) => (
                <div
                  onClick={() => {
                    setStatusExpanded(false)
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
            <Histories histories={histories.slice(0, 1)} />
          ) : (
            <img className={cx('not-found')} alt="not found" src={notFound} />
          )}
        </div>
      )}
    </div>
  )
}
