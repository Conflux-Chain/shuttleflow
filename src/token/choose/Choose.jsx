import React, { useState } from 'react'

import { Input, Badge, Button } from '@cfxjs/react-ui'
import TokenList from '../TokenList'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

const FREQUENT_TOKENS = [
    ['BTC'], ['ETC'], ['USDT'], ['DAI'], ['USDC']
]
export default function ChooseToken({ location: { search } }) {
    const [next, cToken] = ['next', 'cToken']
        .map(u => new URLSearchParams(decodeURI(search)).get(u))

    const [searchTxt, setSearchTxt] = useState('')

    //TODO which props should be used to generate wallet address
    const [token, setToken] = useState('')
    const { t } = useTranslation()
    return <div>
        <Input
            onChange={e => { setSearchTxt(e.target.value) }}
            width={'100%'}
            value={searchTxt}
            placeholder={t('placeholder.token-search')} />
        <h6>{t('sentence.frequent-token')}</h6>
        <div>
            {FREQUENT_TOKENS.map(([name]) => {
                return <Badge key={name}>{name}</Badge>
            })}
        </div>
        <h6>{t('sentence.token-list')}</h6>


        <TokenList search={searchTxt} token={token} setToken={setToken} cToken={cToken} />

        <Link to={`${next}?token=${token}`}>
            <Button disabled={!token} >{t('sentence.choose-token')}</Button>
        </Link>



    </div>
}

