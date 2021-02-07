import React, { useState } from 'react'
import useStyle from '../component/useStyle'
import styles from './Market.module.scss'

import Triangle from '../component/Triangle/Triangle.jsx'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'

import { useTranslation } from 'react-i18next'
import MainContainer from '../component/MainContainer/MainContainer'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import Icon from '../component/Icon/Icon'
import useTokenListSearch from '../data/useTokenList'

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

export default function Market() {
  const tokens = useTokenListSearch()
  const [cx] = useStyle(styles)
  const { t } = useTranslation('market')
  const [sort, setSort] = useState('name')
  return (
    <MainContainer
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
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
      <Scrollbars
        renderThumbVertical={renderThumbVertical}
        style={{ flex: 1, position: 'relative' }}
      >
        <PaddingContainer>
          {tokens.sort(sorts[sort]).map((tokenInfo) => {
            const {
              icon,
              symbol,
              reference_name,
              _total_supply,
              name,
              origin,
            } = tokenInfo
            return (
              <div key={symbol} className={cx('list')}>
                <div className={cx('left')}>
                  <Icon
                    {...tokenInfo}
                    cToken
                    style={{ marginRight: '1rem' }}
                  />
                  <div className={cx('txt')}>
                    <div className={cx('large-txt')}>{symbol}</div>
                    <div className={cx('small-txt')}>
                      {name || 'conflux ' + reference_name}
                    </div>
                  </div>
                </div>
                <div className={cx('right')}>{_total_supply}</div>
              </div>
            )
          })}
        </PaddingContainer>
      </Scrollbars>
    </MainContainer>
  )
}
