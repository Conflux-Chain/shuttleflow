import React, { useEffect, useRef, lazy } from 'react'
import { Switch, Route, Redirect, useParams } from 'react-router-dom'
import Modal from '../component/Modal'

import { useTranslation } from 'react-i18next'

import useState1 from '../lib/useState1'
import useAddress, { login } from '../data/useAddress'
import { useRouteMatch } from 'react-router-dom'
import CHAIN_CONFIG, { CAPTAIN } from '../config/chainConfig'
const Token = lazy(() =>
  import(
    /* webpackChunkName: "Token" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */ '../token/Token'
  )
)
const Shuttle = lazy(() =>
  import(
    /* webpackChunkName: "Shuttle" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */ '../shuttle/Shuttle'
  )
)
const Captain = lazy(() =>
  import(
    /* webpackChunkName: "Captain" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */ '../captain/Captain'
  )
)
const History = lazy(() =>
  import(
    /* webpackChunkName: "History" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    '../history/History'
  )
)
const Market = lazy(() =>
  import(
    /* webpackChunkName: "Market" */
    /* webpackPrefetch: true */
    /* webpackPreload: true */
    '../market/Market'
  )
)


function Main() {
  const address = useAddress()
  const match = useRouteMatch()

  const { chain } = useParams()

  //When referer detected, display popup and then login
  const [{ popup, referer }, setState] = useState1({
    popup: false,
    referer: false,
  })

  //make sure only login once, set true when login is not desired
  const initLoginTriggered = useRef(false)

  useEffect(() => {
    if (!address) {
      if (referer && !popup) {
        setState({ popup: true })
        setTimeout(() => {
          // reset referer
          setState({ popup: false, referer: false })
          login()
        }, 2000)
      } else if (!initLoginTriggered.current) {
        //prevent the login another time
        initLoginTriggered.current = true
        login()
      }
    }
  }, [address, referer, popup, setState])

  const { t } = useTranslation()
  return (
    <>
      <Switch>
        <Redirect from={match.url} exact to={`${match.url}/shuttle`} />
        <Route
          render={({ location: { pathname } }) => {
            // debugger
            if (
              !address &&
              pathname !== `/${chain}/shuttle/in` &&
              pathname !== `/${chain}/shuttle` &&
              pathname !== `/${chain}/market` &&
              pathname !== `/${chain}`
            ) {
              //prevent the default init login
              initLoginTriggered.current = true
              return (
                <PopupWrapper setReferer={(referer) => setState({ referer })}>
                  <Redirect
                    to={{ pathname: `/${chain}/shuttle/in` }}
                  ></Redirect>
                </PopupWrapper>
              )
            } else {
              return (
                <Switch>
                  <Route path={`${match.path}/token`} component={Token} />
                  <Route path={`${match.path}/shuttle`} component={Shuttle} />
                  <Route path={`${match.path}/history`} component={History} />
                  <Route path={`${match.path}/market`} component={Market} />
                  {CHAIN_CONFIG[chain].captain !== CAPTAIN.NONE && (
                    <Route path={`${match.path}/captain`} component={Captain} />
                  )}
                </Switch>
              )
            }
          }}
        />
      </Switch>
      <Modal show={popup}>
        <div style={{ whiteSpace: 'nowrap' }}>{t('login')}</div>
      </Modal>

    </>
  )
}

function PopupWrapper({ setReferer, children }) {
  useEffect(() => {
    return () => {
      setReferer(true)
    }
  }, [setReferer])
  return children
}

export default React.memo(Main)
