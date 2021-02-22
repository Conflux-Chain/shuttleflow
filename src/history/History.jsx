import React, { useState } from 'react'
import historyStyles from './history.module.scss'
import useStyle from '../component/useStyle'
import Accordion from '../component/Accordion'
import { useTranslation } from 'react-i18next'
import useOperationHistory from '../data/useOperationHistory'
import { useHistory } from 'react-router-dom'
import notFound from '../component/not-found.png'
import Histories from './Histories'
import open from './down.svg'
import { Loading } from '@cfxjs/react-ui'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import MainContainer from '../component/MainContainer/MainContainer'
import useUrlSearch from '../lib/useUrlSearch'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'

const FILTERS = [
  ['all', ['doing', 'finished']],
  ['success', ['finished']],
  ['pending', ['doing']],
]

export default function History() {
  const [cx] = useStyle(historyStyles)
  const { t } = useTranslation('history')
  const [statusExpanded, setStatusExpanded] = useState(false)
  const [typeExpanded, setTypeExpanded] = useState(false)
  const [filter, setFilter] = useState(0)
  const { type = 'in' } = useUrlSearch()
  const history = useHistory()

  const { data: histories, loading } = useOperationHistory({
    status: FILTERS[filter][1],
    type,
  })

  return (
    <div className={cx('history-container')}>
      <MainContainer className={cx('select')}>
        <Accordion
          expanded={typeExpanded}
          contentStyle={{ position: 'absolute', left: 0, right: 0, zIndex: 1 }}
          title={
            <div
              onClick={() => {
                setTypeExpanded((x) => !x)
                setStatusExpanded(false)
              }}
              className={cx('filter-container')}
            >
              <div className={cx('select-item', 'filter-txt')}>
                {t(type === 'in' ? 'shuttle-in' : 'shuttle-out')}
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
              {['in', 'out'].map((key) => (
                <div
                  onClick={() => {
                    setTypeExpanded(false)
                    history.push({
                      search: `?type=${key}`,
                    })
                  }}
                  key={key}
                  className={cx('select-item', 'dropdown-item', 'hover', {
                    active: key === type,
                  })}
                >
                  {t(key === 'in' ? 'shuttle-in' : 'shuttle-out')}
                </div>
              ))}
            </div>
          }
        />
        <Accordion
          expanded={statusExpanded}
          contentStyle={{ position: 'absolute', left: 0, right: 0, zIndex: 1 }}
          title={
            <div
              onClick={() => {
                setTypeExpanded(false)
                setStatusExpanded((x) => !x)
              }}
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
      </MainContainer>
      {loading ? (
        <div className={cx('loading')}>
          <Loading size="large" />
        </div>
      ) : (
        <Scrollbars
          renderThumbVertical={renderThumbVertical}
          style={{ flex: 1 }}
        >
          <PaddingContainer
            bottom
            style={{
              backgroundColor: '#1b1b1b',
              display: 'flow-root',
            }}
          >
            <div className={cx('history-items')}>
              {histories.length > 0 ? (
                <Histories histories={histories} />
              ) : (
                <img
                  className={cx('not-found')}
                  alt="not found"
                  src={notFound}
                />
              )}
            </div>
          </PaddingContainer>
        </Scrollbars>
      )}
    </div>
  )
}
