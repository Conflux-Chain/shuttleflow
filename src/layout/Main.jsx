import React, { useEffect, useRef, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Modal from '../component/Modal'

import { useTranslation } from 'react-i18next'

import useState1 from '../data/useState1'
import useAddress, { login } from '../data/useAddress'
const Token = lazy(() => import('../token/Token'))
const Shuttle = lazy(() => import('../shuttle/Shuttle'))
const Captain = lazy(() => import('../captain/Captain'))
const History = lazy(() => import('../history/History'))
const Market = lazy(() => import('../market/Market'))

function Main() {
  const address = useAddress()

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
        <Redirect from={'/'} exact to="/shuttle" />
        <Route
          render={({ location: { pathname } }) => {
            if (
              !address &&
              pathname !== '/shuttle/in' &&
              pathname !== '/shuttle' &&
              pathname !== '/market' &&
              pathname !== '/'
            ) {
              //prevent the default init login
              initLoginTriggered.current = true
              return (
                <PopupWrapper setReferer={(referer) => setState({ referer })}>
                  <Redirect to={{ pathname: '/shuttle/in' }}></Redirect>
                </PopupWrapper>
              )
            } else {
              return (
                <Switch>
                  <Route path="/token" component={Token} />
                  <Route path="/shuttle" component={Shuttle} />
                  <Route path="/captain" component={Captain} />
                  <Route path="/history" component={History} />
                  <Route path="/market" component={Market} />
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
