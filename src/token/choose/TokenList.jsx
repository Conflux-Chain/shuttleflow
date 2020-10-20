import React, { useEffect, useRef } from 'react'
import useStyle from '../../component/useStyle'

import linkSrc from './link.svg'
import notFound from '../../component/not-found.png'
import shuttle from '../../component/cIcon.svg'
import tokenListStyles from './TokenList.module.scss'
import titleStyles from './title.module.scss'
import Check from './Check.jsx'
import { useTranslation } from 'react-i18next'
import formatAddress from '../../component/formatAddress'
import useTokenList from '../../data/useTokenList'

const FREQUENT_TOKENS = ['0x6b175474e89094c44da98b954eedeac495271d0f']

function TokenList({
  token,
  setToken,
  search = '',
  cToken,
  frequent,
  showMortgage,
  setIsNotAvailable, //if the corresponsing cToken available
}) {
  const { tokens: tokenList, isLoading: isListLoading } = useTokenList()
  const { tokens: displayedList, isLoading: isDisplayedLoading } = useTokenList(
    search
  )

  const { t } = useTranslation()
  const [ListCx, titleCx] = useStyle(tokenListStyles, titleStyles)
  const isNotAvailable = useRef(false)

  useEffect(() => {
    if (setIsNotAvailable) {
      setIsNotAvailable(isNotAvailable.current)
    }
  }, [search, setIsNotAvailable])

  if (isListLoading || isDisplayedLoading) {
    return <h1>Loading</h1>
  }

  console.log(tokenList)
  return (
    //we should combine frequent token and tokenlist in one component
    //cause they share the same container of fixed height
    <div
      style={{
        height: 'calc(100vh - 33.5rem)',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {frequent && !search && tokenList.length && (
        <>
          <div className={titleCx('title')}>{t('txt.frequent-token')}</div>
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
      {!search && <div className={titleCx('title')}>{t('txt.token-list')}</div>}

      <div className={ListCx('container')}>
        {displayedList.length === 0 ? (
          // <h1>Not found</h1>
          <img
            alt="not found"
            className={ListCx('not-found')}
            src={notFound}
          ></img>
        ) : (
          displayedList.map(
            (
              {
                reference_symbol,
                reference_name,
                reference,
                ctoken,
                notAvailable,
                sponsor_value,
                icon,
              },
              i
            ) => {
              if (notAvailable) {
                isNotAvailable.current = true
              }
              let _address = reference
              const checked = token === _address
              let link = `https://etherscan.io/token/${reference}`
              if (cToken) {
                reference_symbol = 'c' + reference_symbol
                reference = ctoken
                reference_name = 'Conflux ' + reference_name
                link = `https://confluxscan.io/token/${ctoken}`
              }
              return (
                <div
                  key={i}
                  className={ListCx('row', { checked })}
                  onClick={() => setToken(checked ? '' : _address)}
                >
                  <Check active={checked} />
                  <div className={ListCx('img-container')}>
                    <img alt="icon" className={ListCx('icon')} src={icon}></img>
                    <img
                      src={shuttle}
                      className={ListCx('cicon')}
                      alt="ctoken"
                    />
                  </div>

                  <div className={ListCx('two-row')}>
                    <div className={ListCx('symbol-row')}>
                      <span className={ListCx('symbol')}>
                        {reference_symbol}
                      </span>

                      {notAvailable && (
                        <span className={ListCx('not-available')}>
                          {t('txt.not-available')}
                        </span>
                      )}
                    </div>

                    <span className={ListCx('name')}>{reference_name}</span>
                  </div>

                  <div
                    className={ListCx('two-row')}
                    style={{ alignItems: 'flex-end' }}
                  >
                    {showMortgage && sponsor_value && (
                      <span className={ListCx('mortgage')}>
                        {sponsor_value + ' cETH'}
                      </span>
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
                </div>
              )
            }
          )
        )}
      </div>
    </div>
  )
}

export default React.memo(TokenList)
