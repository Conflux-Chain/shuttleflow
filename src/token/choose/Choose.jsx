import React, { useState } from 'react'

import { Button } from '@cfxjs/react-ui'
import TokenList from '../TokenList'
import searchIcon from '../search.svg'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import classNamesBind from "classnames/bind";
import chooseStyles from './Choose.module.scss'
import inputStyles from '../../component/input.module.scss'
import useClass from '../../component/useStyle'
const cx = classNamesBind.bind(chooseStyles)

const FREQUENT_TOKENS = [
    ['BTC'], ['ETC'], ['USDT'], ['DAI'], ['USDC']
]
export default function ChooseToken({ location: { search } }) {
    const [chooseCx,inputCx]=useClass(chooseStyles,inputStyles)
    const [next, cToken] = ['next', 'cToken']
        .map(u => new URLSearchParams(decodeURI(search)).get(u))

    const [searchTxt, setSearchTxt] = useState('')

    //TODO which props should be used to generate wallet address
    const [token, setToken] = useState('')
    const { t } = useTranslation()
    return <div className={cx('container')}>
        <div className={chooseCx('input-container')}>
            <img src={searchIcon}></img>
            <input
                className={inputCx('input-common')}
                onChange={e => { setSearchTxt(e.target.value) }}
                width={'100%'}
                value={searchTxt}
                placeholder={t('placeholder.token-search')} />
        </div>

        <div className={cx('title')}>{t('sentence.frequent-token')}</div>
        <div className={cx('frequent-container')}>
            {FREQUENT_TOKENS.map(([name]) => {
                return <div className={cx('frequent')} key={name}>{name}</div>
            })}
        </div>
        <div className={cx('title')}>{t('sentence.token-list')}</div>


        <TokenList search={searchTxt} token={token} setToken={setToken} cToken={cToken} />

        <Link to={`${next}?token=${token}`}>
            <Button disabled={!token} >{t('sentence.choose-token')}</Button>
        </Link>



    </div>
}



