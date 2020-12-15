import React, { useEffect } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
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
import useTokenList from '../data/useTokenList'

export default function Shuttle({
  location: { search },
  match: { path, url },
}) {
  const [cx] = useStyle(styles)
  const { t } = useTranslation(['nav'])
  const inUrl = `${url}/in`
  const outUrl = `${url}/out`
  const [, setLayoutBottom] = useRecoilState(layoutBottomState)

  const urlToken = new URLSearchParams(search).get('token')
  const { tokens } = useTokenList({ erc20: urlToken || '' })

  //display tokenInfo only when token is url available
  const tokenInfo = urlToken && tokens ? tokens[0] : null

  useEffect(() => {
    setLayoutBottom('8.5rem')
    return () => setLayoutBottom('0rem')
  }, [setLayoutBottom])

  return (
    <MainContainer style={{ background: '#1b1b1b' }}>
      <nav className={cx('nav')}>
        <MenuLink
          to={inUrl}
          render={({ active }) => {
            return (
              <div className={cx('item', { active })}>
                <Link to={inUrl}>
                  <img alt="in" src={active ? inActiveSvg : inSvg}></img>
                  <span>{t('shuttle-in')}</span>
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
                  <span>{t('shuttle-out')}</span>
                </Link>
              </div>
            )
          }}
        />
      </nav>
      <PaddingContainer bottom>
        <Switch>
          <Redirect from={path} exact to={`${path}/in`} />
          <Route
            path={`${path}/in`}
            render={(props) => (
              <ShuttleIn tokenInfo={tokenInfo} next={props.match.url} />
            )}
          />
          <Route
            path={`${path}/out`}
            render={(props) => (
              <ShuttleOut
                {...props}
                tokenInfo={tokenInfo}
                next={props.match.url}
              />
            )}
            // component={ShuttleOut}
          />
        </Switch>
      </PaddingContainer>
    </MainContainer>
  )
}
