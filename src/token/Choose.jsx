import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { buildSearch } from '../component/urlSearch'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'

import TokenList from './TokenList'
import Search from './Search'
import Button from './Button'

import useStyle from '../component/useStyle'
import chooseStyles from './Choose.module.scss'

export default function ChooseToken({
  caption,
  cToken,
  next,
  setTokenExternal,
  ...extra
}) {
  const [chooseCx] = useStyle(chooseStyles)
  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [token, setToken] = useState('')
  const [notFound, setNotFound] = useState(false)
  const { t } = useTranslation(['token'])

  //the "token state should be maintained internally"
  //expose it external rather than externally controll
  useEffect(() => {
    setTokenExternal(token)
  }, [token, setTokenExternal])

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
        <PaddingContainer bottom>
          <Button
            path={{
              pathname: isNotAvailable ? '/caption' : next,
              search: buildSearch({ token, ...extra }),
            }}
            disabled={caption ? !token : !token && !isNotAvailable}
          >
            {caption
              ? 'Be caption'
              : t(isNotAvailable ? 'add-token' : 'choose-btn')}
          </Button>
        </PaddingContainer>
      )}
    </div>
  )
}
