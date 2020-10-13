import React, { useEffect, useRef } from 'react'
import useStyle from '../../component/useStyle'
import useSWR from 'swr'

import linkSrc from './link.svg'
import tokenListStyles from './TokenList.module.scss'
import titleStyles from './title.module.scss'
import Check from './Check.jsx'
import { useTranslation } from 'react-i18next'
import formatAddress from '../../component/formatAddress'

import swrTokenListFetcher from '../../data/mock/swrTokenListFetcher'
import swrSearchTokenFetcher from '../../data/mock/swrSearchTokenFetcher'


const FREQUENT_TOKENS = [
    'btc',
    'eth',
    '0x_address_of_usdt',
    '0x_address_of_dai',
    '0x_address_of_usdc'
]

export default function TokenList({
    token,
    setToken,
    search = '',
    cToken,
    frequent,
    showMortgage,
    setIsNotAvailable, //if the corresponsing cToken available
}) {
    const isAddress = checkIsAddress(search)
    const { data: tokenList } = useSWR(isAddress ? null : '/tokenList', swrTokenListFetcher)
    const { data: tokenSearchResult } = useSWR(isAddress ? ['/address', search] : null, swrSearchTokenFetcher)

    const displayedList = isAddress ? [tokenSearchResult].filter(x => x)
        : tokenList ? tokenList.filter(({ name, symbol }) => {
            return (
                name.toLowerCase().indexOf(search) > -1 ||
                symbol.toLowerCase().indexOf(search) > -1
            )
        }) : []


    const { t } = useTranslation()
    const [ListCx, titleCx] = useStyle(tokenListStyles, titleStyles)
    const isNotAvailable = useRef(false)


    useEffect(() => {
        if (setIsNotAvailable) {
            setIsNotAvailable(isNotAvailable.current)
        }
    }, [search, setIsNotAvailable])

    //prefetch not work properly somehow
    useEffect(() => {
        // console.log(token, 'is selected and prefetched')
        // mutate(['/address', token], swrSearchTokenFetcher('/address', token))
    }, [token])






    return (
        //we should combine frequent token and tokenlist in one component
        //cause they share the same container of fixed height
        <div
            style={{ height: 'calc(100vh - 32rem)', overflow: 'auto' }}>
            {frequent && <>
                <div className={titleCx('title')}>{t('txt.frequent-token')}</div>
                <div className={ListCx('frequent-container')}>
                    {FREQUENT_TOKENS.map((_address) => {
                        let tokenData, active
                        if (tokenList) {
                            tokenData = tokenList.find(({ address }) => address === _address)
                            active = tokenData.address === token
                        }
                        return (
                            <div
                                onClick={tokenData && (() => setToken(tokenData.address))}
                                className={ListCx({ active }, 'frequent')} key={_address}>
                                {tokenData && (cToken ? tokenData.cSymbok : tokenData.symbol)}
                            </div>
                        )
                    })}
                </div>
            </>}
            <div className={titleCx('title')}>{t('txt.token-list')}</div>

            <div className={ListCx('container')}>
                {displayedList.length === 0 ? <h1>Not found</h1> :
                    displayedList.map(
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
                                <div key={symbol} className={ListCx('row', { checked })}>
                                    <label>
                                        <Check active={checked} />
                                        <input
                                            type="checkbox"
                                            onChange={() => setToken(checked ? '' : _address)}
                                            checked={checked}
                                        />
                                    </label>
                                    <img alt='icon' className={ListCx('icon')} src={icon}></img>
                                    <div className={ListCx('two-row')}>
                                        <div className={ListCx('symbol-row')}>
                                            <span className={ListCx('symbol')}>{symbol}</span>

                                            {notAvailable && (
                                                <span className={ListCx('not-available')}>
                                                    {t('txt.not-available')}
                                                </span>
                                            )}
                                        </div>

                                        <span className={ListCx('name')}>{name}</span>
                                    </div>

                                    <div className={ListCx('two-row')} style={{ alignItems: 'flex-end' }}>
                                        {showMortgage && minMortgage && (
                                            <span className={ListCx('mortgage')}>{minMortgage + 'cETH'}</span>
                                        )}

                                        <div className={ListCx('link')}>
                                            <span className={ListCx('link-txt')}>
                                                {address && address.startsWith('0x') && formatAddress(address)}
                                            </span>
                                            {address && address.startsWith('0x') && (
                                                <img alt='link' className={ListCx('link-img')} src={linkSrc}></img>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
            </div>


            {/* <TokenList
          search={searchTxt}
          token={token}
          setToken={setToken}
          cToken={cToken}
          setIsNotAvailable={setIsNotAvailable}
        /> */}
        </div>


    )
}


function checkIsAddress(v) {
    return v.startsWith('0x')
}
