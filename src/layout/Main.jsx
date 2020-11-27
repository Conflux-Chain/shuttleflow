import React, { useEffect, useState, useRef } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Modal from '../component/Modal'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import Shuttle from '../shuttle/Shuttle'
import Token from '../token/Token'
import Caption from '../token/caption/Caption'
import History from '../history/History'
import Market from '../market/Market'
import { useTranslation } from 'react-i18next'

function Main() {
  const { address, login } = useConfluxPortal()
  const [popup, setPopup] = useState(false)
  //When referer detected, display popup and then login
  const [referer, setReferer] = useState(false)
  //When not login, should login automatically
  const [initLogin, setInitLogin] = useState(false)
  //make sure only login once, set true when login is not desired
  const isInitLogin = useRef(false)

  useEffect(() => {
    let tm
    if (!address) {
      if (referer) {
        setPopup(true)
        tm = setTimeout(() => {
          setPopup(false)
          //reset referer so the popup can bring up again
          setReferer(false)
          login()
        }, 2000)
      }
      if (initLogin && !isInitLogin.current) {
        //prevent the login another time
        isInitLogin.current = true
        login()
      }
    }
    return () => {
      clearTimeout(tm)
    }
  }, [address, referer, initLogin, login])

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
              isInitLogin.current = true
              return (
                <PopupWrapper setReferer={setReferer}>
                  <Redirect to={{ pathname: '/shuttle/in' }}></Redirect>
                </PopupWrapper>
              )
            } else {
              return (
                <EnsureLogin setInitLogin={setInitLogin}>
                  <Switch>
                    <Route path="/token" component={Token} />
                    <Route path="/shuttle" component={Shuttle} />
                    <Route path="/caption" component={Caption} />
                    <Route path="/history" component={History} />
                    <Route path="/market" component={Market} />
                  </Switch>
                </EnsureLogin>
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

function EnsureLogin({ children, setInitLogin }) {
  useEffect(() => {
    setInitLogin(true)
  }, [])
  return children
}

export default React.memo(Main)
