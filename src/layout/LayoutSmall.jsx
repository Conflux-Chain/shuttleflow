import React, { useState, useRef } from 'react'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import '../i18n/i18n'

import logo from './logo.svg'
import ham from './ham.svg'
import close from './close.svg'
import up from './up.svg'

import Main from './Main'

import Accordion from '../component/Accordion'

import { TokenNavigation } from '../token/Token'

import layouyStyles from './LayoutSmall.module.scss'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'

import { useRecoilState } from 'recoil'
import LayoutButtomState from './LayoutButtomState'
import useStyle from '../component/useStyle'

export default function LayoutSmall(props) {
  const [cx] = useStyle(layouyStyles)
  const history = useHistory()
  const [dropdown, setDropdown] = useState(false)
  const [lngOpen, setLngOpen] = useState(false)
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
                alt='ham'
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
              <img alt='logo' className={cx('logo')} src={logo}></img>
            </Link>
            <div className={cx('right')}>
              <span>Address</span>
              <img
                alt='ham'
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
        <nav ref={nodeRef} className={cx('dropdown')}>
          <div className={cx('item')} onClick={() => { history.push('/history') }}>{t('btn.history')}</div>
          <div className={cx('item')} onClick={() => { history.push('/market') }}>{t('btn.markets')}</div>
          <div className={cx('item')} onClick={() => { history.push('/caption') }}>{t('btn.be-caption')}</div>
          <Accordion expanded={lngOpen} title={
            <div className={cx('item')} style={{ position: 'relative' }}>
              <span>{t('btn.choose-lng')}</span>
              <img onClick={() => { setLngOpen(x => !x) }} className={cx('up', { lngOpen: !lngOpen })} src={up}></img>
            </div>}
            content={<div>
              <div className={cx('item', 'lng-item')}>中文</div>
              <div className={cx('item', 'lng-item')}>English</div>
            </div>}
          />

        </nav>
      </CSSTransition>
      <main
        className={cx('main')}
        style={{
          //7.625rem is the height header
          maxHeight: `calc(100vh - 7.625rem - ${bottomHeight})`,
        }}
      >
        <Main />
      </main>
    </div>
  )
}
