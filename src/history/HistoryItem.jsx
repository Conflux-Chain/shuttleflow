import React, { useState } from 'react'
import Accordion from '../component/Accordion'
import useStyle from '../component/useStyle'
import itemStyle from './historyItem.module.scss'
import open from './open.svg'
import link from './link.svg'
import { useTranslation } from 'react-i18next'

const STEPS = {
  mint: ['init', 'main', 'shuttle', 'conflux'],
  burn: ['init', 'conflux', 'shuttle', 'main'],
}

export default function HistoryItem(props) {
  const { amount, step, type, icon, symbol, nonce_or_txid, settled_tx } = props
  const steps = STEPS[type]
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
                  {symbol}
                </div>
                <div style={{ color: '#AEB0C2' }} className={cx('small-txt')}>
                  {t(steps[step])}
                </div>
              </div>
            </div>
            <div className={cx('two-row', 'end')}>
              <div
                style={{ color: type === 'mint' ? '#FFA467' : '#44D7B6' }}
                className={cx('large-txt', 'amount')}
              >
                {amount}
              </div>
              <div className={cx('small-txt')}>
                {step === 3 ? (
                  <div style={{ color: '#7CD77B' }}>{t('success')}</div>
                ) : (
                  <div className={cx('pending')}>
                    <div className={cx('dot-container')}>
                      <div
                        style={{ animationDelay: '0s' }}
                        className={cx('dot')}
                      />
                      <div
                        style={{ animationDelay: '0.3s' }}
                        className={cx('dot')}
                      />
                      <div
                        style={{ animationDelay: '0.6s' }}
                        className={cx('dot')}
                      />
                    </div>
                    <div style={{ color: '#0091FF' }}> {t('pending')}</div>
                  </div>
                )}
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
                <div className={cx('item', { complete: i <= step })}>
                  {t(s)}
                  <img
                    className={cx('img')}
                    src={link}
                    alt="link"
                    onClick={() => {
                      let url
                      if (i <= 1) {
                        if (type === 'mint') {
                          console.log('nonce_or_txid', nonce_or_txid)
                          url = 'https://etherscan.io/tx/' + nonce_or_txid
                        } else {
                          url =
                            'https://confluxscan.io/transactionsdetail/' +
                            nonce_or_txid
                        }
                      } else {
                        if (type === 'mint') {
                          url =
                            'https://confluxscan.io/transactionsdetail/' +
                            settled_tx
                        } else {
                          url = 'https://etherscan.io/tx/' + settled_tx
                        }
                      }
                      window.open(url, '_blank')
                    }}
                  />
                </div>
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
