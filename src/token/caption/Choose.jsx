import React, { useState } from 'react';
import {  Button } from '@cfxjs/react-ui';
import TokenList from '../TokenList'
import Search from '../Search'

export default function Choose({ match: { url }, history }) {

    const [token, setToken] = useState('')
    const [searchTxt, setSearchTxt] = useState('')

    return <div>
        <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />

        <TokenList token={token} search={searchTxt} setToken={setToken} showMortgage />
        <Button disabled={!token} onClick={() => history.push({
            pathname: url,
            search: `?token=${token}`
        })}>
            Be caption
        </Button>



    </div>

}