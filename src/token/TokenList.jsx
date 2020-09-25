import React, { Suspense, useEffect, useRef, useState } from 'react'
import useTokenList from '../data/useTokenList'
import useStyle from '../component/useStyle'

import linkSrc from './link.svg'
import styles from './TokenList.module.scss'
import Check from './Check.jsx'
import { useTranslation } from 'react-i18next'

function TokenList({
  token,
  setToken,
  search = '',
  cToken,
  showMortgage,
  setIsNotAvailable,
}) {
  const { tokenList } = useTokenList(search)
  const { t } = useTranslation()
  const [cx] = useStyle(styles)
  const isNotAvailable = useRef(false)

  useEffect(() => {
    if (setIsNotAvailable) {
      setIsNotAvailable(isNotAvailable.current)
    }
  }, [search])

  return (
    <div className={cx('container')}>
      {tokenList.map(
        ({
          symbol,
          cSymbol,
          name,
          cName,
          address,
          cAddress,
          notAvailable,
          minMortgage,
          icon,
        }) => {
          if (notAvailable) {
            isNotAvailable.current = true
          }
          let _address = address
          const checked = token === _address
          if (cToken) {
            symbol = cSymbol
            address = cAddress
            name = cName
          }
          return (
            <div key={symbol} className={cx('row')}>
              <label>
                <Check active={checked} />
                <input
                  type="checkbox"
                  onChange={() => setToken(checked ? '' : _address)}
                  checked={checked}
                />
              </label>
              <img className={cx('icon')} src={icon}></img>
              <div className={cx('two-row')}>
                <div className={cx('symbol-row')}>
                  <span className={cx('symbol')}>{symbol}</span>

                  {notAvailable && (
                    <span className={cx('not-available')}>
                      {t('word.not-available')}
                    </span>
                  )}
                </div>

                <span className={cx('name')}>{name}</span>
              </div>

              <div className={cx('two-row')} style={{ alignItems: 'flex-end' }}>
                {showMortgage && (
                  <span className={cx('mortgage')}>{minMortgage + 'cETH'}</span>
                )}

                <div className={cx('link')}>
                  <span className={cx('link-txt')}>
                    {address && short(address)}
                  </span>
                  {address && (
                    <img className={cx('link-img')} src={linkSrc}></img>
                  )}
                </div>
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}

function short(txt) {
  const first6 = txt.slice(0, 6)
  const last4 = txt.slice(txt.length - 4)
  return first6 + '...' + last4
}

export default function TokenListWithSuspense({ ...props }) {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <TokenList {...props} />
    </Suspense>
  )
}
