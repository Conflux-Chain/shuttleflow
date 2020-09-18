import React, { useState } from 'react';
import { Input, Button } from '@cfxjs/react-ui';
import TokenList from '../TokenList'

export default function Choose({ match: { url }, history }) {
    
    const [token, setToken] = useState('')
    const [search, setSearch] = useState('')

    return <div>
        <Input></Input>

        <TokenList token={token} search={search} setToken={setToken} showMortgage />
        <Button disabled={!token} onClick={() => history.push({
            pathname: url,
            search: `?token=${token}`
        })}>
            Be caption
        </Button>



    </div>

}