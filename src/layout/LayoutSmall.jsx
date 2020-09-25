import React, { useState, useRef } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import '../i18n/i18n'

import logo from './logo.svg'
import ham from './ham.svg'
import close from './close.svg'

import Main from './Main'

import { TokenNavigation } from '../token/Token'
import tokenStyles from '../token/Token.module.scss'

import classNamesBind from 'classnames/bind'
import layouyStyles from './LayoutSmall.module.scss'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'

import { useRecoilState } from 'recoil'
import LayoutButtomState from './LayoutButtomState'

const cx = classNamesBind.bind({ ...layouyStyles, ...tokenStyles })

export default function LayoutSmall(props) {
  const [dropdown, setDropdown] = useState(false)
  const nodeRef = useRef(null)
  const isTokenRoute = !!useRouteMatch('/token')
  const { t } = useTranslation()
  const [bottomHeight] = useRecoilState(LayoutButtomState)

  return (
    <div className={cx('container')}>
      {isTokenRoute ? (
        <div className={cx('header')}>
          <TokenNavigation
            {...props}
            after={
              <img
                className={cx('ham')}
                src={dropdown ? close : ham}
                onClick={() => {
                  setDropdown((x) => !x)
                }}
              ></img>
            }
          />
        </div>
      ) : (
        <header className={cx('header', 'top-level')}>
          <Link to="/">
            <img className={cx('logo')} src={logo}></img>
          </Link>
          <div className={cx('right')}>
            <span>Address</span>
            <img
              className={cx('ham')}
              src={dropdown ? close : ham}
              onClick={() => {
                setDropdown((x) => !x)
              }}
            ></img>
          </div>
        </header>
      )}

      <CSSTransition
        nodeRef={nodeRef}
        classNames={{
          enter: cx('enter'),
          enterActive: cx('enterActive'),
          enterDone: cx('enterDone'),
          exitActive: cx('exitActive'),
        }}
        in={dropdown}
        mountOnEnter
        timeout={{ enter: 200, exit: 200 }}
        unmountOnExit
      >
        <div ref={nodeRef} className={cx('dropdown')}>
          <Link to="/history">History</Link>
          <Link to="/market">Market</Link>
          <Link to="/caption">Be caption</Link>
          <div>{t('sentence.choose-lng')}</div>
        </div>
      </CSSTransition>
      <div
        className={cx('main')}
        style={{
          maxHeight: `calc(100vh - 6.625rem - ${bottomHeight})`,
        }}
      >
        <Main />
      </div>
    </div>
  )
}
