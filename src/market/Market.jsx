import React, { Suspense, useState } from 'react'
import useSWR from 'swr'
import useStyle from '../component/useStyle'
import swrTokenListFetcher from '../data/mock/swrTokenListFetcher'
import styles from './Market.module.scss'
import shuttle from '../component/shuttle.svg'

import Triangle from './Triangle.jsx'
import { useTranslation } from 'react-i18next'

const sorts = {
  name: (a, b) => { return a.cSymbol.localeCompare(b.cSymbol) },
  'name-reverse': (a, b) => { return a.cSymbol.localeCompare(b.cSymbol) * -1 },
  supply: (a, b) => { return a.supply - b.supply },
  'supply-reverse': (a, b) => { return b.supply - a.supply }
}


function Market() {
  const { data: tokens } = useSWR('/tokenList', swrTokenListFetcher, { suspense: true })
  const [cx] = useStyle(styles)
  const { t } = useTranslation()
  const [sort, setSort] = useState('name')
  return <div >
    <div className={cx('header')}>
      <div className={cx('item')}>
        <div>
          <span>{t('Token')}</span>
        </div>
        <div className={cx('btn')}>
          <Triangle active={sort === 'name'} onClick={() => { setSort('name') }} />
          <Triangle reverse={true} active={sort === 'name-reverse'}
            onClick={() => { setSort('name-reverse') }}
          />
        </div>
      </div>

      <div className={cx('item')}>
        <div>
          <span>{t('Total Supply')}</span>
        </div>
        <div className={cx('btn')}>
          <Triangle active={sort === 'supply'} onClick={() => { setSort('supply') }} />
          <Triangle reverse={true} active={sort === 'supply-reverse'}
            onClick={() => { setSort('supply-reverse') }}
          />
        </div>
      </div>


    </div>
    {tokens
      .sort(sorts[sort])
      .map(({ icon, cSymbol, cName, supply }) => {
        return <div key={cSymbol} className={cx('list')} >
          <div className={cx('left')}>
            <div className={cx('img-container')}>
              <img className={cx('img')} src={icon}></img>
              <img className={cx('shuttle')} src={shuttle}></img>
            </div>


            <div className={cx('txt')}>
              <div className={cx('large-txt')}>{cSymbol}</div>
              <div className={cx('small-txt')}>{cName}</div>
            </div>
          </div>
          <div className={cx('right')}>{supply}</div>
        </div>
      })}
  </div>
}

export default function () {
  return <Suspense fallback={<div>Loading market</div>}>
    <Market />
  </Suspense>
}

