import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../component/Button/Button'

import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import pocket from '../component/pocket.png'
import TokenList from './TokenList'
import Search from './Search'

import useStyle from '../component/useStyle'
import chooseStyles from './Choose.module.scss'
import useUrlSearch from '../lib/useUrlSearch'
import useIsSamll from '../component/useSmallScreen'
import { useHistory, useParams } from 'react-router'
import useState1 from '../lib/useState1'

export default function ChooseToken({ captain, cToken, next }) {
  const [chooseCx] = useStyle(chooseStyles)
  const [{ txt: searchTxt, searching }, setSearch] = useState1({
    txt: '',
    searching: false,
  })
  const searchTimer = useRef()

  const { chain } = useParams()
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const { selected } = useUrlSearch()
  const isSmall = useIsSamll()
  const history = useHistory()
  const { t } = useTranslation(['token'])

  return (
    <div className={chooseCx('container')}>
      <PaddingContainer bottom={false}>
        <Search
          searchTxt={searchTxt}
          setSearchTxt={(txt) => {
            setSearch({ txt, searching: true })
            if (searchTimer.current) {
              clearTimeout(searchTimer.current)
            }
            searchTimer.current = setTimeout(() => {
              setSearch({ searching: false })
            }, 1000)
          }}
        />
      </PaddingContainer>
      <TokenList
        search={searchTxt}
        searching={searching}
        frequent={!captain}
        captain={captain}
        cToken={cToken}
        notFound={notFound}
        setNotFound={setNotFound}
        setIsNotAvailable={setIsNotAvailable}
      />

      {!notFound && (
        <PaddingContainer>
          {[
            <Button
              key="btn"
              className={chooseCx('btn')}
              onClick={() => {
                history.push(
                  isNotAvailable
                    ? `/${chain}/captain?pair=${selected}`
                    : typeof next === 'function'
                    ? next(selected)
                    : next
                )
              }}
              disabled={captain ? !selected : !selected && !isNotAvailable}
            >
              {captain
                ? t('be-captain')
                : t(isNotAvailable ? 'add-token' : 'choose-btn')}
            </Button>,
            !captain && (
              <div
                key="benefit"
                className={chooseCx('benefit')}
                onClick={() => {
                  window.open(
                    `/${chain}/captain${selected ? '?pair=' + selected : ''}`,
                    '_blank'
                  )
                }}
              >
                {t('captain-benefit')}
                <img
                  className={chooseCx('pocket')}
                  src={pocket}
                  alt="pocket"
                ></img>
              </div>
            ),
          ][isSmall ? 'reverse' : 'slice']()}
        </PaddingContainer>
      )}
    </div>
  )
}
