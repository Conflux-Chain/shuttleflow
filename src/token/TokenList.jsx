import React, { Suspense } from 'react'
import useTokenList from '../data/useTokenList'

import styles from './TokenList.module.scss'
import classNamesBind from 'classnames/bind'
import Check from './Check.jsx'
const cx = classNamesBind.bind(styles)

function TokenList({ token, setToken, search = '', cToken, showMortgage }) {
    const { tokenList } = useTokenList(search)
    return <div>
        {tokenList.map(({ symbol, cSymbol, name, cName, erc20, notAvailable, mortgage }) => {
            const checked = token === symbol
            return <div key={symbol} className={cx('row')}>
                <label>
                    <Check active={checked} />
                    <input type='checkbox'
                        onChange={() => setToken(checked ? '' : symbol)}
                        checked={checked} />
                </label>

                <div className={cx('two-row')}>
                    <span>{cToken ? cSymbol : symbol}</span>
                    <span>{cToken ? cName : name}</span>
                </div>

                <div className={cx('two-row')}>
                    <span >{erc20}</span>
                    <span >{showMortgage && mortgage + 'cETH'}</span>
                </div>

                <span style={{ marginLeft: 10 }}>{notAvailable && 'notAvailable'}</span>
            </div>
        })}
    </div>

}

export default function TokenListWithSuspense({ ...props }) {
    return <Suspense fallback={<div>loading...</div>}>
        <TokenList {...props} />
    </Suspense>
}
