import React, { useState } from 'react'
import HistoryItem from './HistoryItem'
import historyStyles from './history.module.scss'
import useStyle from '../component/useStyle'
import Accordion from '../component/Accordion'

const status = ['all', 'success', 'failed', 'pending']
export default function History() {
  const [cx] = useStyle(historyStyles)
  const [expanded, setExpanded] = useState(false)
  const [current, setCurrent] = useState(status[0])
  return <div className={cx('history-container')}>
    <div className={cx('select')}>
      <Accordion
        expanded={expanded}
        title={
          <div
            className={cx('select-item')}
            onClick={() => setExpanded(x => !x)}>{current}</div>
        }
        content={

          <div className={cx('select-content')}>
            {
              status.map(status => (<div
                onClick={() => {
                  setExpanded(false)
                  setCurrent(status)
                }}
                key={status}
                className={cx('select-item', 'hover', { active: status === current })}>
                {status}
              </div>))
            }
          </div>
        } />
    </div>
    <div className={cx('history-items')}>
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
      <HistoryItem />
    </div>
  </div>
}
