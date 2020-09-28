import React, { Suspense, useEffect, useRef } from 'react'
import useStyle from '../component/useStyle'
import useSWR, { mutate } from 'swr'

import linkSrc from './link.svg'
import styles from './TokenList.module.scss'
import Check from './Check.jsx'
import { useTranslation } from 'react-i18next'

import swrTokenListFetcher from '../data/mock/swrTokenListFetcher'
import swrSearchTokenFetcher from '../data/mock/swrSearchTokenFetcher'


function TokenList({
    token,
    setToken,
    search = '',
    cToken,
    showMortgage,
    setIsNotAvailable, //if the corresponsing cToken available
}) {
    const isAddress = checkIsAddress(search)
    console.log('isAddress', isAddress)
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
    const [cx] = useStyle(styles)
    const isNotAvailable = useRef(false)


    useEffect(() => {
        if (setIsNotAvailable) {
            setIsNotAvailable(isNotAvailable.current)
        }
    }, [search])

    //prefetch
    useEffect(() => {
        console.log(token, 'is selected and prefetched')
        // mutate(['/address', token], swrSearchTokenFetcher('/address', token))
    }, [token])




    return (
        <div className={cx('container')}>
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


function checkIsAddress(v) {
    return v.startsWith('0x')
}
