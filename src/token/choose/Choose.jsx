import React, { useEffect, useState } from 'react'

import TokenList from '../TokenList'
import Search from '../Search'

import { useTranslation } from 'react-i18next'

import chooseStyles from './Choose.module.scss'
import buttonStyle from '../../component/button.module.scss'


import useStyle from '../../component/useStyle'
import layoutBottomState from '../../layout/LayoutButtomState'

import { useRecoilState } from 'recoil'
import useIsSamll from '../../component/useSmallScreen'
import { buildSearch, parseSearch } from '../../component/urlSearch'



export default function ChooseToken({ location: { search }, history }) {
  const [chooseCx, btnCx] = useStyle(chooseStyles, buttonStyle)
  const { next, cToken, ...extra } = parseSearch(search)

  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  const [token, setToken] = useState('')
  const { t } = useTranslation()
  const isSmall = useIsSamll()

  const [, setLayoutBottom] = useRecoilState(layoutBottomState)

  useEffect(() => {
    if (isSmall) {
      setLayoutBottom('14rem')
      return () => {
        setLayoutBottom('0rem')
      }
    }
  }, [isSmall, setLayoutBottom])

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

      <div className={chooseCx('btn-container')}>
        <button
          onClick={() => {
            history.push({
              pathname: next,
              search: buildSearch({ token, ...extra }),
            })
          }}
          className={btnCx('btn') + ' ' + chooseCx('btn')}
          disabled={!token && !isNotAvailable}
        >
          {t(
            isNotAvailable ? 'btn.add-token' : 'btn.choose-token-btn'
          )}
        </button>
      </div>
    </div >
  )
}
