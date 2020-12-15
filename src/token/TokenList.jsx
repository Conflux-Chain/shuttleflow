import React, { useEffect, useState } from 'react'
import useStyle from '../component/useStyle'

import linkSrc from '../component/link-64.png'
import notFoundSrc from '../component/not-found.png'
import tokenListStyles from './TokenList.module.scss'
import Triangle from '../component/Triangle/Triangle.jsx'
import titleStyles from './title.module.scss'
import Check from './Check.jsx'
import { useTranslation } from 'react-i18next'
import formatAddress from '../component/formatAddress'
import useTokenList from '../data/useTokenList'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import { CONFLUXSCAN_TK, EHTHERSCAN_TK } from '../config/config'
import Icon from '../component/Icon/Icon'
import { Loading } from '@cfxjs/react-ui'

const FREQUENT_TOKENS = [
  'btc',
  'eth',
  '0xdac17f958d2ee523a2206206994597c13d831ec7', //usdt
  '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', //usdc
]

const sorts = {
  name: (a, b) => {
    return a.symbol.localeCompare(b.symbol)
  },
  'name-reverse': (a, b) => {
    return a.symbol.localeCompare(b.symbol) * -1
  },
}

function TokenList({
  token,
  setToken,
  search = '',
  cToken,
  frequent,
  showMortgage,
  setNotFound,
  setIsNotAvailable, //if the corresponsing cToken available
}) {
  const { tokens: tokenList, isLoading: isListLoading } = useTokenList({})
  const {
    tokens: displayedList,
    isLoading: isDisplayedLoading,
  } = useTokenList({ search, cToken })

  const { t } = useTranslation(['token'])
  const [ListCx, titleCx] = useStyle(tokenListStyles, titleStyles)
  const [sort, setSort] = useState('name')

  useEffect(() => {
    if (setNotFound && displayedList) {
      setNotFound(displayedList.length === 0)
    }
  }, [displayedList, setNotFound])

  if (isListLoading || isDisplayedLoading) {
    return (
      <PaddingContainer bottom={false}>
        <Loading size="large" />
      </PaddingContainer>
    )
  }

  return (
    //we should combine frequent token and tokenlist in one component
    //cause they share the same container of fixed height
    <Scrollbars
      autoHide
      renderThumbVertical={renderThumbVertical}
      style={{
        flex: 1,
        position: 'relative',
      }}
    >
      <PaddingContainer bottom={false}>
        {frequent && !search && tokenList.length && (
          <>
            <div className={titleCx('title')}>{t('frequent')}</div>
            <div className={ListCx('frequent-container')}>
              {FREQUENT_TOKENS.map((_preset_reference) => {
                let tokenData, active
                if (tokenList.length > 0) {
                  tokenData = tokenList.find(
                    ({ reference }) => reference === _preset_reference
                  )
                  //frequent token is hardcoded, in case the
                  //tokenlist change and hardcoded data not found
                  if (!tokenData) {
                    return null
                  }
                  active = tokenData.reference === token
                }
                return (
                  <div
                    onClick={() => setToken(active ? '' : tokenData.reference)}
                    className={ListCx({ active }, 'frequent')}
                    key={_preset_reference}
                  >
                    {(cToken ? 'c' : '') + tokenData.reference_symbol}
                  </div>
                )
              })}
            </div>
          </>
        )}
        {!search && (
          <div className={ListCx('list-title') + ' ' + titleCx('title')}>
            <span>{t('list')}</span>
            <div className={ListCx('right')}>
              <span className={ListCx('name')}> {t('Name')}</span>
              <div className={ListCx('btns')}>
                <Triangle
                  onClick={() => setSort('name')}
                  active={sort === 'name'}
                ></Triangle>
                <Triangle
                  active={sort === 'name-reverse'}
                  onClick={() => setSort('name-reverse')}
                  reverse={true}
                ></Triangle>
              </div>
            </div>
          </div>
        )}
      </PaddingContainer>
      <div className={ListCx('container')}>
        {displayedList.length === 0 ? (
          <img
            alt="not found"
            className={ListCx('not-found')}
            src={notFoundSrc}
          ></img>
        ) : (
          displayedList
            .slice()
            .sort(sorts[sort])
            .map((tokenInfo, i) => {
              return (
                <TokenRow
                  key={i}
                  {...{
                    ...tokenInfo,
                    token,
                    cToken,
                    checked: token === tokenInfo.reference,
                    showMortgage,
                    setToken,
                    setIsNotAvailable,
                  }}
                />
              )
            })
        )}
      </div>
    </Scrollbars>
  )
}

function TokenRow({
  supported,
  in_token_list,
  reference_symbol,
  reference_name,
  reference,
  ctoken,
  sponsor_value,
  icon,
  cToken,
  showMortgage,
  setToken,
  setIsNotAvailable,
  checked,
}) {
  const [ListCx] = useStyle(tokenListStyles, titleStyles)
  const { t } = useTranslation(['token'])
  const notAvailable = supported === 0
  let _address = reference
  let link = `${EHTHERSCAN_TK}${reference}`
  if (cToken) {
    reference_symbol = 'c' + reference_symbol
    reference = ctoken
    reference_name = 'Conflux ' + reference_name
    link = `${CONFLUXSCAN_TK}${ctoken}`
  }
  return (
    <PaddingContainer
      bottom={false}
      className={ListCx('row', { checked })}
      onClick={() => {
        setToken(checked ? '' : _address)
        setIsNotAvailable(notAvailable)
      }}
    >
      <div className={ListCx('left')}>
        <Check active={checked} />
        <Icon
          risk={in_token_list === 0}
          src={icon}
          conflux={cToken}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        />
        <div className={ListCx('two-row')}>
          <div className={ListCx('symbol-row')}>
            <span className={ListCx('symbol')}>{reference_symbol}</span>

            {notAvailable && (
              <span className={ListCx('not-available')}>
                {t('not-available')}
              </span>
            )}
          </div>

          <span className={ListCx('name')}>{reference_name}</span>
        </div>
      </div>

      <div className={ListCx('two-row')} style={{ alignItems: 'flex-end' }}>
        {showMortgage && sponsor_value && (
          <span className={ListCx('mortgage')}>{sponsor_value + ' cETH'}</span>
        )}

        <div className={ListCx('link')}>
          <span className={ListCx('link-txt')}>
            {reference &&
              reference.startsWith('0x') &&
              formatAddress(reference)}
          </span>
          {reference && reference.startsWith('0x') && (
            <img
              alt="link"
              onClick={() => window.open(link, '_blank')}
              className={ListCx('link-img')}
              src={linkSrc}
            ></img>
          )}
        </div>
      </div>
    </PaddingContainer>
  )
}

export default React.memo(TokenList)
