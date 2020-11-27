import React, { Suspense, useState } from 'react'
import useStyle from '../component/useStyle'
import styles from './Market.module.scss'
import shuttle from '../component/cIcon.svg'

import Triangle from '../component/Triangle/Triangle.jsx'
import { useTranslation } from 'react-i18next'
import useTokenList from '../data/useTokenList'

const sorts = {
  name: (a, b) => {
    return a.symbol.localeCompare(b.symbol)
  },
  'name-reverse': (a, b) => {
    return a.symbol.localeCompare(b.symbol) * -1
  },
  supply: (a, b) => {
    return a.total_supply - b.total_supply
  },
  'supply-reverse': (a, b) => {
    return b.total_supply - a.total_supply
  },
}

function Market() {
  const { tokens } = useTokenList()
  const [cx] = useStyle(styles)
  const { t } = useTranslation('market')
  const [sort, setSort] = useState('name')
  return (
    <>
      <div className={cx('header')}>
        <div className={cx('item')}>
          <div>
            <span>{t('token')}</span>
          </div>
          <div className={cx('btn')}>
            <Triangle
              active={sort === 'name'}
              onClick={() => {
                setSort('name')
              }}
            />
            <Triangle
              reverse={true}
              active={sort === 'name-reverse'}
              onClick={() => {
                setSort('name-reverse')
              }}
            />
          </div>
        </div>

        <div className={cx('item')}>
          <div>
            <span>{t('supply')}</span>
          </div>
          <div className={cx('btn')}>
            <Triangle
              active={sort === 'supply'}
              onClick={() => {
                setSort('supply')
              }}
            />
            <Triangle
              reverse={true}
              active={sort === 'supply-reverse'}
              onClick={() => {
                setSort('supply-reverse')
              }}
            />
          </div>
        </div>
      </div>
      {tokens
        .slice()
        .sort(sorts[sort])
        .map(({ icon, symbol, reference_name, total_supply }) => {
          return (
            <div key={symbol} className={cx('list')}>
              <div className={cx('left')}>
                <div className={cx('img-container')}>
                  <img alt="icon" className={cx('img')} src={icon}></img>
                  <img
                    alt="shuttle"
                    className={cx('shuttle')}
                    src={shuttle}
                  ></img>
                </div>

                <div className={cx('txt')}>
                  <div className={cx('large-txt')}>{symbol}</div>
                  <div className={cx('small-txt')}>
                    {'conflux ' + reference_name}
                  </div>
                </div>
              </div>
              <div className={cx('right')}>{total_supply}</div>
            </div>
          )
        })}
    </>
  )
}

export default function () {
  return (
    <Suspense fallback={<div>Loading market</div>}>
      <Market />
    </Suspense>
  )
}
