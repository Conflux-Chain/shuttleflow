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
  const addressRef = useRef(address)
  addressRef.current = address
  const [popup, _setPopup] = useState(false)

  function setPopup(v) {
    console.log('want to set popup')
    setTimeout(() => {
      if (!addressRef.current) {
        _setPopup(v)
      }
    }, 500)
  }
  const { t } = useTranslation()
  return (
    <>
      <Switch>
        <Redirect from={'/'} exact to="/shuttle" />
        <Route
          render={({ location }) => {
            const { pathname } = location
            if (
              !address &&
              pathname !== '/shuttle/in' &&
              pathname !== '/shuttle' &&
              pathname !== '/market' &&
              pathname !== '/'
            ) {
              return (
                <RedirectWrapper
                  login={login}
                  setPopup={setPopup}
                  to={{
                    pathname: '/shuttle/in',
                    state: { from: pathname },
                  }}
                ></RedirectWrapper>
              )
            }
            return (
              <Switch>
                <Route path="/token" component={Token} />
                <Route path="/shuttle" component={Shuttle} />
                <Route path="/caption" component={Caption} />
                <Route path="/history" component={History} />
                <Route path="/market" component={Market} />
              </Switch>
            )
          }}
        />
      </Switch>
      <Modal show={popup}>{t('login')}</Modal>
    </>
  )
}

function RedirectWrapper({ setPopup, login, ...props }) {
  useEffect(() => {
    return () => {
      setPopup(true)
      setTimeout(() => {
        setPopup(false)
        login()
      }, 2000)
    }
  }, [setPopup, login])
  return <Redirect {...props} />
}

export default React.memo(Main)
