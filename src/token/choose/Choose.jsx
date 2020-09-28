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

const FREQUENT_TOKENS = [['BTC'], ['ETC'], ['USDT'], ['DAI'], ['USDC']]
export default function ChooseToken({ location: { search }, history }) {
  const [chooseCx, btnCx] = useStyle(chooseStyles, buttonStyle)
  const { next, cToken, ...extra } = parseSearch(search)



  const [searchTxt, setSearchTxt] = useState('')
  const [isNotAvailable, setIsNotAvailable] = useState(false)
  //TODO which props should be used to generate wallet address
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
  }, [isSmall])

  return (
    <div className={chooseCx('container')}>
      <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />

      <div className={chooseCx('title')}>{t('sentence.frequent-token')}</div>
      <div className={chooseCx('frequent-container')}>
        {FREQUENT_TOKENS.map(([name]) => {
          return (
            <div className={chooseCx('frequent')} key={name}>
              {name}
            </div>
          )
        })}
      </div>
      <div className={chooseCx('title')}>{t('sentence.token-list')}</div>

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
            isNotAvailable ? 'sentence.add-token' : 'sentence.choose-token-btn'
          )}
        </button>
      </div>
    </div>
  )
}
