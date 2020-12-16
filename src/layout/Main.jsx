import React, { useEffect, useRef, useReducer } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Modal from '../component/Modal'
import useConfluxPortal from '../lib/useConfluxPortal'
import Shuttle from '../shuttle/Shuttle'
import Token from '../token/Token'
import Caption from '../caption/Caption'
import History from '../history/History'
import Market from '../market/Market'
import { useTranslation } from 'react-i18next'

function reducer(state, action) {
  return { ...state, ...action }
}

function Main() {
  const { address, login } = useConfluxPortal()
  //When referer detected, display popup and then login
  const [{ popup, referer }, dispatch] = useReducer(reducer, {
    popup: false,
    referer: false,
  })

  //make sure only login once, set true when login is not desired
  const initLoginTriggered = useRef(false)

  useEffect(() => {
    if (!address) {
      if (referer && !popup) {
        dispatch({ popup: true })
        setTimeout(() => {
          // reset referer
          dispatch({ popup: false, referer: false })
          login()
        }, 2000)
      } else if (!initLoginTriggered.current) {
        //prevent the login another time
        initLoginTriggered.current = true
        login()
      }
    }
  }, [address, referer, login, popup])

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
                <PopupWrapper setReferer={(referer) => dispatch({ referer })}>
                  <Redirect to={{ pathname: '/shuttle/in' }}></Redirect>
                </PopupWrapper>
              )
            } else {
              return (
                <Switch>
                  <Route path="/token" component={Token} />
                  <Route path="/shuttle" component={Shuttle} />
                  <Route path="/caption" component={Caption} />
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
