import React, { useCallback, useEffect, useRef, useState } from 'react'

import Main from './Main'
import logo from './logo.png'
import triangle from './triangle.svg'

import classNamesBind from 'classnames/bind'
import styles from './LayoutLarge.module.scss'
import MenuLink from '../component/MenuLink'
import { useTranslation } from 'react-i18next'

import Accordion from '../component/Accordion'
import UserAddress from './UserAddress'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'

const cx = classNamesBind.bind(styles)

export default function LayoutLarge({ history }) {
  const [expandLng, setExpandLng] = useState(false)
  const { t, i18n } = useTranslation()
  const headerRef = useRef(null)
  const [mainMaxHeight, setMainMaxHeight] = useState(0)
  const clickAway = useCallback(() => {
    setExpandLng(false)
  }, [])

  useEffect(() => {
    const { bottom } = headerRef.current.getBoundingClientRect()
    let { marginBottom } = getComputedStyle(headerRef.current)
    marginBottom = parseFloat(marginBottom.replace('px', ''))
    const { innerHeight } = window
    setMainMaxHeight(innerHeight - bottom - marginBottom - 40)
  }, [])

  return (
    <>
      <header ref={headerRef} className={cx('header')}>
        <img
          className={cx('logo')}
          alt="home"
          onClick={() => history.push('/')}
          src={logo}
        ></img>

        <div className={cx('right')}>
          <UserAddress />
          <MenuLink
            to="/shuttle"
            render={({ active }) => {
              return (
                <div
                  onClick={() => history.push('/')}
                  className={cx('item', { active })}
                >
                  {t('home')}
                </div>
              )
            }}
          />
          <MenuLink
            to="/history"
            render={({ active }) => {
              return (
                <div
                  onClick={() => history.push('/history')}
                  className={cx('item', { active })}
                >
                  {t('history')}
                </div>
              )
            }}
          />
          <MenuLink
            to="/market"
            render={({ active }) => {
              return (
                <div
                  onClick={() => history.push('/market')}
                  className={cx('item', { active })}
                >
                  {t('markets')}
                </div>
              )
            }}
          />
          <MenuLink
            to="/help"
            render={({ active }) => {
              return (
                <div
                  onClick={() => window.open(t('help-link'), '_blank')}
                  className={cx('item', { active })}
                >
                  {t('help')}
                </div>
              )
            }}
          />
          <MenuLink
            to="/caption"
            render={({ active }) => {
              return (
                <div
                  onClick={() => history.push('/caption')}
                  className={cx('item', { active })}
                >
                  {t('be-caption')}
                </div>
              )
            }}
          />
          <Accordion
            contentStyle={{ position: 'absolute', right: '2rem', top: '5rem' }}
            clickAway={clickAway}
            expanded={expandLng}
            title={
              <div
                className={cx('lng')}
                onClick={() => {
                  setExpandLng((x) => {
                    return !x
                  })
                }}
              >
                <span>{i18n.language === 'zh' ? '中文' : 'English'}</span>
                <img
                  alt="up"
                  className={cx('up', { 'icon-active': !expandLng })}
                  src={triangle}
                ></img>
              </div>
            }
            content={
              <div className={cx('dropdown-container')}>
                <div
                  onClick={() => {
                    i18n.changeLanguage('en')
                    setExpandLng(false)
                  }}
                  className={cx('lng-item', {
                    selected: i18n.language === 'en',
                  })}
                >
                  English
                </div>
                <div
                  onClick={() => {
                    i18n.changeLanguage('zh')
                    setExpandLng(false)
                  }}
                  className={cx('lng-item', {
                    selected: i18n.language === 'zh',
                  })}
                >
                  中文
                </div>
              </div>
            }
          ></Accordion>
        </div>
      </header>
      <Scrollbars
        renderThumbVertical={renderThumbVertical}
        style={{
          width: '544px',
          margin: 'auto',
          borderRadius: '0.5rem',
          maxHeight: mainMaxHeight,
        }}
      >
        <Main />
      </Scrollbars>
    </>
  )
}
