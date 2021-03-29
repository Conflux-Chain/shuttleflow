import React, { useState } from 'react'
import useStyle from '../component/useStyle'
import styles from './Market.module.scss'

import Triangle from '../component/Triangle/Triangle.jsx'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'

import { useTranslation } from 'react-i18next'
import MainContainer from '../component/MainContainer/MainContainer'
import { Scrollbars } from 'react-custom-scrollbars-2'
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
    return a._total_supply - b._total_supply
  },
  'supply-reverse': (a, b) => {
    return b._total_supply - a._total_supply
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
        renderThumbHorizontal={() => <div></div>}
        renderThumbVertical={renderThumbVertical}
        style={{ flex: 1, position: 'relative' }}
      >
        {tokens.sort(sorts[sort]).map((tokenInfo) => {
          const { symbol, reference_name, _total_supply, name } = tokenInfo
          return (
            <PaddingContainer key={symbol} className={cx('list')}>
              <Icon {...tokenInfo} txt cToken style={{ marginRight: '1rem' }} />
              <div className={cx('right')}>{_total_supply}</div>
            </PaddingContainer>
          )
        })}
      </Scrollbars>
    </MainContainer>
  )
}
