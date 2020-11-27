import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { buildSearch, parseSearch } from '../../component/urlSearch'
import PaddingContainer from '../../component/PaddingContainer/PaddingContainer'

import TokenList from './TokenList'
import Search from './Search'
import Button from './Button'

import useStyle from '../../component/useStyle'
import chooseStyles from './Choose.module.scss'

export default function ChooseToken({
  location: { search },
  caption,
  next: nextFromProps,
}) {
  const [chooseCx] = useStyle(chooseStyles)
  const { next: nextFromUrl, cToken, ...extra } = parseSearch(search)

  const next = nextFromProps || nextFromUrl
  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [token, setToken] = useState('')
  const [notFound, setNotFound] = useState(false)
  const { t } = useTranslation(['token'])

  return (
    <div className={chooseCx('container')}>
      <PaddingContainer bottom={false}>
        <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />
      </PaddingContainer>
      <TokenList
        search={searchTxt}
        token={token}
        frequent={!caption}
        showMortgage={caption}
        setToken={setToken}
        cToken={cToken}
        notFound={notFound}
        setNotFound={setNotFound}
        setIsNotAvailable={setIsNotAvailable}
      />

      {!notFound && (
        <PaddingContainer>
          <Button
            path={{
              pathname: next,
              search: buildSearch({ token, ...extra }),
            }}
            disabled={caption ? !token : !token && !isNotAvailable}
          >
            {caption
              ? 'Be caption'
              : t(isNotAvailable ? 'btn.add-token' : 'choose-btn')}
          </Button>
        </PaddingContainer>
      )}
    </div>
  )
}
