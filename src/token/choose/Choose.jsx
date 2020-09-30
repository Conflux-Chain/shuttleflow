import React, { useEffect, useState } from 'react'

import TokenList from '../TokenList'
import Search from '../Search'

import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import swrTokenListFetcher from '../../data/mock/swrTokenListFetcher'

import chooseStyles from './Choose.module.scss'
import buttonStyle from '../../component/button.module.scss'
import useStyle from '../../component/useStyle'
import layoutBottomState from '../../layout/LayoutButtomState'

import { useRecoilState } from 'recoil'
import useIsSamll from '../../component/useSmallScreen'
import { buildSearch, parseSearch } from '../../component/urlSearch'


import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

const FREQUENT_TOKENS = [
  'btc',
  'eth',
  '0x_address_of_usdt',
  '0x_address_of_dai',
  '0x_address_of_usdc'
]
export default function ChooseToken({ location: { search }, history }) {
  const [chooseCx, btnCx] = useStyle(chooseStyles, buttonStyle)
  const { next, cToken, ...extra } = parseSearch(search)
  const { data: tokenList } = useSWR('/tokenList', swrTokenListFetcher)

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
  }, [isSmall])

  return (
    <div className={chooseCx('container')}>
      <Search searchTxt={searchTxt} setSearchTxt={setSearchTxt} />

      <div
        style={{ maxHeight: 'calc(100vh - 32rem)', overflow: 'auto' }}>
        <div className={chooseCx('title')}>{t('txt.frequent-token')}</div>
        <div className={chooseCx('frequent-container')}>
          {FREQUENT_TOKENS.map((_address) => {
            let tokenData, active
            if (tokenList) {
              tokenData = tokenList.find(({ address }) => address === _address)

              active = tokenData.address === token
            }
            return (
              <div
                onClick={tokenData && (() => setToken(tokenData.address))}
                className={chooseCx({ active }, 'frequent')} key={_address}>
                {tokenData && (cToken ? tokenData.cSymbok : tokenData.symbol)}
              </div>
            )
          })}
        </div>
        <div className={chooseCx('title')}>{t('txt.token-list')}</div>
        <TokenList
          search={searchTxt}
          token={token}
          setToken={setToken}
          cToken={cToken}
          setIsNotAvailable={setIsNotAvailable}
        />
      </div>

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
