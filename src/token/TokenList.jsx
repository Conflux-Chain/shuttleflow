import React, { useEffect, useState } from 'react'
import useStyle from '../component/useStyle'

import linkSrc from '../component/link-64.png'
import notFoundSrc from '../component/not-found.png'
import tokenListStyles from './TokenList.module.scss'
import Triangle from '../component/Triangle/Triangle.jsx'
import titleStyles from './title.module.scss'
import Check from '../component/Check/Check'
import { useTranslation } from 'react-i18next'
import { formatAddress } from '../util/address'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import { CONFLUXSCAN_TK, EHTHERSCAN_TK } from '../config/config'
import Icon from '../component/Icon/Icon'
import { buildSearch } from '../component/urlSearch'
import { useHistory, useParams } from 'react-router-dom'
import useUrlSearch from '../lib/useUrlSearch'
import WithQuestion from '../component/WithQuestion'
import Modal, { modalStyles } from '../component/Modal'
import { useBlockWithRisk } from '../layout/Risk'
import CHAIN_CONFIG from '../config/chainConfig'
import useTokenListSearch from '../data/useTokenList'

const sorts = {
  name: (a, b) => {
    return a.symbol.localeCompare(b.symbol)
  },
  'name-reverse': (a, b) => {
    return a.symbol.localeCompare(b.symbol) * -1
  },
}

function TokenList({
  search = '',
  searching,
  cToken,
  frequent,
  captain,
  setNotFound,
  setIsNotAvailable, //if the corresponsing cToken available
}) {
  const history = useHistory()
  const { selected, ...searchParams } = useUrlSearch()
  const { chain } = useParams()

  const tokenList = useTokenListSearch()
  const displayedList = useTokenListSearch({ search, cToken })

  const setToken = (selected) => {
    history.push(buildSearch({ ...searchParams, selected }))
  }

  const { t } = useTranslation(['token'])
  const [ListCx, titleCx, modalCx] = useStyle(
    tokenListStyles,
    titleStyles,
    modalStyles
  )
  const [sort, setSort] = useState('name')

  const [popup, setPopup] = useState(false)

  useEffect(() => {
    if (setNotFound && displayedList) {
      setNotFound(displayedList.length === 0)
    }
  }, [displayedList, setNotFound])

  return (
    <>
      {/* we should combine frequent token and tokenlist in one component 
      cause they share the same container of fixed height */}
      <Scrollbars
        renderThumbVertical={renderThumbVertical}
        style={{ flex: 1, position: 'relative' }}
      >
        <PaddingContainer bottom={false}>
          {frequent && !search && tokenList.length && (
            <>
              <div className={titleCx('title')}>{t('frequent')}</div>
              <div className={ListCx('frequent-container')}>
                {CHAIN_CONFIG[chain].frequentTokens.map((_preset_reference) => {
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
                    active = tokenData.id === selected
                  }
                  return (
                    <div
                      onClick={() => setToken(active ? '' : tokenData.id)}
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
              <WithQuestion onClick={() => setPopup(true)}>
                <span>{t('list')}</span>
              </WithQuestion>

              <div className={ListCx('right')}>
                <span className={ListCx('name')}> {t('name')}</span>
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
              .slice(0, searching ? 5 : undefined)
              .sort(!search ? sorts[sort] : undefined)
              .map((tokenInfo, i) => {
                console.log()
                return (
                  <TokenRow
                    key={i}
                    tokenInfo={tokenInfo}
                    {...{
                      token: selected,
                      chain,
                      cToken,
                      checked:
                        tokenInfo.is_admin === 1 && captain
                          ? false
                          : selected === tokenInfo.id,
                      disabled: tokenInfo.is_admin === 1 && captain,
                      captain,
                      setToken,
                      setIsNotAvailable,
                    }}
                  />
                )
              })
          )}
        </div>
      </Scrollbars>
      <Modal
        show={popup}
        title={t('list')}
        onClose={() => setPopup(false)}
        clickAway={() => setPopup(false)}
      >
        <div
          style={{
            textAlign: 'center',
          }}
          className={modalCx('content')}
        >
          {t('gecko')}
        </div>
        <div
          onClick={() =>
            window.open(
              'https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json',
              '_blank'
            )
          }
          className={modalCx('btn')}
        >
          {t('gecko-btn')}
        </div>
      </Modal>
    </>
  )
}

function TokenRow({
  tokenInfo,
  sponsor_value,
  cToken,
  captain,
  disabled,
  setToken,
  setIsNotAvailable,
  checked,
  chain,
}) {
  const {
    supported,
    in_token_list,
    reference_symbol,
    reference_name,
    reference,
    symbol,
    origin,
    id,
    ctoken,
    icon,
  } = tokenInfo
  const [ListCx] = useStyle(tokenListStyles, titleStyles)
  const { t } = useTranslation(['token'])
  const notAvailable = supported === 0
  const block = useBlockWithRisk()
  const link = cToken
    ? `${CONFLUXSCAN_TK}${ctoken}`
    : `${EHTHERSCAN_TK}${reference}`
  const name = (cToken ? 'Conflux ' : '') + reference_name
  const symbolName = cToken ? symbol : reference_symbol
  const address = cToken
    ? ctoken !== 'cfx' && ctoken
    : reference.startsWith('0x')
    ? reference
    : ''
  const displayChain = cToken ? 'cfx' : chain

  return (
    <PaddingContainer
      bottom={false}
      className={ListCx('row', { checked })}
      onClick={() => {
        if (checked) {
          setToken('')
          setIsNotAvailable(false)
        } else {
          const callback = () => {
            if (!disabled) {
              setToken(id)
              if (notAvailable) {
                setIsNotAvailable(true)
              }
            }
          }
          if (in_token_list) {
            callback()
          } else {
            block(callback)
          }
        }
      }}
    >
      <div className={ListCx('left')}>
        <div style={{ visibility: disabled ? 'hidden' : 'visible' }}>
          <Check checked={checked} />
        </div>

        <Icon
          cToken={!!cToken}
          {...tokenInfo}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        />
        <div className={ListCx('two-row')}>
          <div className={ListCx('symbol-row')}>
            <span className={ListCx('symbol')}>
              {symbolName.length > 10
                ? symbolName.slice(0, 10) + '...'
                : symbolName}
            </span>

            {notAvailable && (
              <span className={ListCx('not-available')}>
                {t('not-available')}
              </span>
            )}
          </div>

          <span className={ListCx('name')}>
            {name.length > 30 ? name.slice(0, 30) + '...' : name}
          </span>
        </div>
      </div>

      <div className={ListCx('two-row')} style={{ alignItems: 'flex-end' }}>
        {captain && sponsor_value && (
          <span className={ListCx('mortgage')}>{sponsor_value + ' cETH'}</span>
        )}

        {address && (
          <div className={ListCx('link')}>
            <span className={ListCx('link-txt')}>
              {formatAddress(address, { chain: displayChain })}
            </span>
            <img
              alt="link"
              onClick={() => window.open(link, '_blank')}
              className={ListCx('link-img')}
              src={linkSrc}
            ></img>
          </div>
        )}
      </div>
    </PaddingContainer>
  )
}

export default React.memo(TokenList)
