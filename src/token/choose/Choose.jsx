import React, { useState } from 'react'

import TokenList from './TokenList'
import Search from './Search'
import Button from './Button'

import { useTranslation } from 'react-i18next'

import chooseStyles from './Choose.module.scss'


import useStyle from '../../component/useStyle'
import { buildSearch, parseSearch } from '../../component/urlSearch'



export default function ChooseToken({ location: { search }, caption, next: nextFromProps }) {
  const [chooseCx] = useStyle(chooseStyles)
  const { next: nextFromUrl, cToken, ...extra } = parseSearch(search)

  const next = nextFromProps || nextFromUrl
  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [token, setToken] = useState('')
  const { t } = useTranslation()


  return (
    <div className={chooseCx('container')}>
      <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />

      <TokenList
        search={searchTxt}
        token={token}
        setToken={setToken}
        cToken={cToken}
        setIsNotAvailable={setIsNotAvailable}
      />

      <Button
        path={{
          pathname: next,
          search: buildSearch({ token, ...extra }),
        }}
        disabled={caption ? !token : (!token && !isNotAvailable)}>
        {caption ? 'Be caption' :
          t(
            isNotAvailable ? 'btn.add-token' : 'btn.choose-token-btn'
          )}
      </Button>


    </div>
  )
}
