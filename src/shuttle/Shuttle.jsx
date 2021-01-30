import React, { useEffect } from 'react'
import { Switch, Route, Link, Redirect, useParams } from 'react-router-dom'
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
import Spec from '../layout/Spec'
import useIsSamll from '../component/useSmallScreen'
import useUrlSearch from '../data/useUrlSearch'
import usePair from '../data/usePair'
export default function Shuttle({ match: { path, url } }) {
  const [cx] = useStyle(styles)
  const { t } = useTranslation(['nav'])
  const inUrl = `${url}/in`
  const outUrl = `${url}/out`
  const isSmall = useIsSamll()
  const [, setLayoutBottom] = useRecoilState(layoutBottomState)
  useEffect(() => {
    setLayoutBottom('8.5rem')
    return () => setLayoutBottom('0rem')
  }, [setLayoutBottom])

  return (
    <MainContainer>
      <div className={cx('footer')}>
        {isSmall && (
          <div className={cx('spec')}>
            <Spec />
          </div>
        )}

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
  const { type } = useParams()
  const { pair = '' } = useUrlSearch()
  const tokenInfo = usePair(pair)
  console.log('tokenInfo',tokenInfo)
  const Component = type === 'in' ? ShuttleIn : ShuttleOut
  return <Component tokenInfo={tokenInfo} />
}
