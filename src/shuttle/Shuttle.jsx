import React, { useEffect, useState } from 'react'
import {
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
  useHistory,
} from 'react-router-dom'
import { useRecoilState } from 'recoil'
import layoutBottomState from '../layout/LayoutButtomState'

import ShuttleIn from './shuttle-in/ShuttleIn'
import ShuttleOut from './shuttle-out/ShuttleOut'

import { useTranslation } from 'react-i18next'
import styles from './Shuttle.module.scss'

import inActiveSvg from './i-in-active-64.png'
import inSvg from './i-in-64.png'
import outActiveSvg from './i-out-active-64.png'
import outSvg from './i-out-64.png'

import MenuLink from '../component/MenuLink'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import useIsSamll from '../component/useSmallScreen'
import useUrlSearch from '../lib/useUrlSearch'
import { usePairInfo } from '../data/useTokenList'
import ChooseChain from '../layout/ChooseChain'
import Button from '../component/Button/Button'
import styled from 'styled-components'
import CHAIN_CONFIG, { CAPTAIN } from '../config/chainConfig'

export default function Shuttle({ match: { path, url } }) {
  const [cx] = useStyle(styles)
  const { t } = useTranslation(['nav'])
  const inUrl = `${url}/in`
  const outUrl = `${url}/out`
  const [, setLayoutBottom] = useRecoilState(layoutBottomState)
  useEffect(() => {
    setLayoutBottom('8.5rem')
    return () => setLayoutBottom('0rem')
  }, [setLayoutBottom])

  return (
    <MainContainer>
      <div className={cx('footer')}>
        <nav className={cx('nav')}>
          <MenuLink
            to={inUrl}
            render={({ active }) => {
              return (
                <div className={cx('item', { active })}>
                  <Link to={inUrl}>
                    <img alt="in" src={active ? inActiveSvg : inSvg}></img>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {t('shuttle-in')}
                    </span>
                  </Link>
                </div>
              )
            }}
          />

          <MenuLink
            to={outUrl}
            render={({ active }) => {
              return (
                <div className={cx('item', { active })}>
                  <Link to={outUrl}>
                    <img alt="out" src={active ? outActiveSvg : outSvg}></img>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {t('shuttle-out')}
                    </span>
                  </Link>
                </div>
              )
            }}
          />
        </nav>
      </div>
      <PaddingContainer bottom>
        <Switch>
          <Redirect from={path} exact to={`${path}/in`} />
          <Route path={`${path}/:type`} component={RouteComponent}></Route>
        </Switch>
      </PaddingContainer>
    </MainContainer>
  )
}

function RouteComponent() {
  const { pair = '' } = useUrlSearch()
  const { chain } = useParams()
  const { data: tokenInfo } = usePairInfo(
    pair || (chain === 'btc' ? 'btc-btc' : '')
  )
  const [feePopup, setFeePopup] = useState(false)
  const { type } = useParams()
  const isSmall = useIsSamll()
  const history = useHistory()
  const Component = type === 'in' ? ShuttleIn : ShuttleOut
  const { t } = useTranslation(['shuttle'])
  let notEnoughGas = false
  let gasLow = null
  //not applicable to BTC (singleton)
  if (tokenInfo && !tokenInfo.singleton) {
    const { sponsorValue, safe_sponsor_amount } = tokenInfo
    console.log(
      'sponsorValue, safe_sponsor_amount',
      sponsorValue + '',
      safe_sponsor_amount + ''
    )
    notEnoughGas = sponsorValue.lt(safe_sponsor_amount)
    gasLow = sponsorValue.lt(safe_sponsor_amount.mul('2')) ? (
      <div style={{ color: 'white' }}>{t('gas-low')}</div>
    ) : null
  }
  return (
    <>
      {isSmall && <ChooseChain />}
      <Component
        gasLow={gasLow}
        notEnoughGas={notEnoughGas}
        tokenInfo={tokenInfo}
        {...{ feePopup, setFeePopup }}
      />
      {notEnoughGas && (
        <div>
          <Text>{t('not-enough-gas')}</Text>
          {CHAIN_CONFIG[chain].captain !== CAPTAIN.NONE && (
            <BeCaptain
              onClick={() => {
                history.push(`/${chain}/captain?pair=${pair}`)
              }}
            >
              {t('be-captain')}
            </BeCaptain>
          )}
        </div>
      )}
    </>
  )
}

const Text = styled.div`
  font-size: 16px;
  line-height: 26px;
  color: white;
  margin-top: 32px;
`

const BeCaptain = styled(Button)`
  border: 1px solid #44d7b6;
  color: #6fcf97;
  background: transparent;
  border-radius: 4px;
  display: inline-block;
  margin: unset;
  height: 40px;
  font-weight: 400;
  font-size: 16px;
`
