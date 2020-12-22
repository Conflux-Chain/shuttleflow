import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import PaddingContainer from '../component/PaddingContainer/PaddingContainer'

import TokenList from './TokenList'
import Search from './Search'
import Button from './Button'

import useStyle from '../component/useStyle'
import chooseStyles from './Choose.module.scss'
import useUrlSearch from '../data/useUrlSearch'

export default function ChooseToken({ caption, cToken, next, ...extra }) {
  const [chooseCx] = useStyle(chooseStyles)
  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const { token } = useUrlSearch()
  const { t } = useTranslation(['token'])

  return (
    <div className={chooseCx('container')}>
      <PaddingContainer bottom={false}>
        <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />
      </PaddingContainer>
      <TokenList
        search={searchTxt}
        frequent={!caption}
        showMortgage={caption}
        cToken={cToken}
        notFound={notFound}
        setNotFound={setNotFound}
        setIsNotAvailable={setIsNotAvailable}
      />

      {!notFound && (
        <PaddingContainer>
          <Button
            path={{
              pathname: isNotAvailable
                ? `/caption/${token}`
                : typeof next === 'function'
                ? next(token)
                : next,
            }}
            disabled={caption ? !token : !token && !isNotAvailable}
          >
            {caption
              ? t('be-caption')
              : t(isNotAvailable ? 'add-token' : 'choose-btn')}
          </Button>
        </PaddingContainer>
      )}
    </div>
  )
}
