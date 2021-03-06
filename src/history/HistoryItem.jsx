import React from 'react'
import Accordion from '../component/Accordion'
import useStyle from '../component/useStyle'
import itemStyle from './historyItem.module.scss'
import { useTranslation } from 'react-i18next'

import open from './open.svg'
import link from '../component/link-64.png'
import { CONFLUXSCAN_TX } from '../config/config'
import CHAIN_CONFIG from '../config/chainConfig'
import { useParams } from 'react-router'

const STEPS = {
  in: ['init-in', 'main', 'shuttle', 'conflux'],
  out: ['init-out', 'conflux', 'shuttle', 'main'],
}

export default function HistoryItem(props) {
  let {
    amount,
    step: currentStep,
    token,
    icon,
    dir,
    symbol,
    nonce_or_txid,
    settled_tx,
    opened,
    setOpened,
    idx,
  } = props
  const steps = STEPS[dir]
  const [cx] = useStyle(itemStyle)
  const { t } = useTranslation('history')
  const { chain } = useParams()

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
                <div className={cx('small-txt')}>{t(steps[currentStep])}</div>
              </div>
            </div>
            <div className={cx('two-row', 'end')}>
              <div
                style={{ color: dir === 'in' ? '#FFA467' : '#44D7B6' }}
                className={cx('large-txt', 'amount')}
              >
                {amount}
              </div>
              <div className={cx('small-txt')}>
                {currentStep === 3 ? (
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
            style={{ display: opened ? 'none' : '' }}
            className={cx('arrow')}
            onClick={() => setOpened(opened ? -1 : idx)}
          >
            <img alt="icon" className={cx('semi-circle')} src={open}></img>
          </div>
        </div>
      }
      expanded={opened}
      content={
        <div className={cx('items')}>
          {STEPS[dir].map((step, i) => {
            return (
              <div key={step} className={cx('item-container')}>
                <div className={cx('bar-container')}>
                  <div
                    className={cx('bar', { complete: i <= currentStep })}
                  ></div>
                  <div
                    className={cx('bar', {
                      complete: i <= currentStep - 1 || currentStep === 3,
                    })}
                  ></div>
                  <div
                    className={cx('circle', {
                      complete: i <= currentStep,
                    })}
                  ></div>
                </div>
                <div
                  style={{ marginBottom: i === 3 ? 0 : '' }}
                  className={cx('item', { complete: i <= currentStep })}
                >
                  {t(step, { chain: t(chain) })}
                  {i > currentStep ||
                  (token === 'btc' &&
                    ((dir === 'in' && i <= 1) ||
                      (dir === 'out' && i > 1))) ? null : (
                    <img
                      className={cx('img')}
                      src={link}
                      alt="link"
                      onClick={() => {
                        let url
                        const _nonce_or_txid = nonce_or_txid.split('_')[0]

                        if (i <= 1) {
                          if (dir === 'in') {
                            url = CHAIN_CONFIG[chain]['tx_url'] + _nonce_or_txid
                          } else {
                            url = CONFLUXSCAN_TX + _nonce_or_txid
                          }
                        } else {
                          if (dir === 'in') {
                            url = CONFLUXSCAN_TX + settled_tx
                          } else {
                            url = CHAIN_CONFIG[chain]['tx_url'] + settled_tx
                          }
                        }
                        window.open(url, '_blank')
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
          <div
            className={cx('arrow')}
            style={{ transform: `rotate(180deg)` }}
            onClick={() => setOpened(opened ? -1 : idx)}
          >
            <img alt="icon" className={cx('semi-circle')} src={open}></img>
          </div>
        </div>
      }
    />
  )
}
