import React, { useCallback, useState } from 'react'

import Main from './Main'
import logo from './logo.svg'
import triangle from './triangle.svg'

import classNamesBind from 'classnames/bind'
import styles from './LayoutLarge.module.scss'
import MenuLink from '../component/MenuLink'
import { useTranslation } from 'react-i18next'

import Accordion from '../component/Accordion'
import UserAddress from './UserAddress'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import useClick from '../data/useClick'

const cx = classNamesBind.bind(styles)

export default function LayoutLarge({ history }) {
  const [expandLng, setExpandLng] = useState(false)
  const { t, i18n } = useTranslation()
  const historyCb = useClick(() => history.push('/history'))
  const clickAway = useCallback(() => {
    setExpandLng(false)
  }, [])

  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <img alt="home" onClick={() => history.push('/')} src={logo}></img>

        <div className={cx('right')}>
          <UserAddress />
          <MenuLink
            to="/history"
            render={({ active }) => {
              return (
                <div onClick={historyCb} className={cx('item', { active })}>
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
          {/* <MenuLink
            to="/caption"
            render={({ active }) => {
              return (
                <div
                  onClick={() => history.push('/caption')}
                  className={cx('item', { active })}
                >
                  {t('btn.be-caption')}
                </div>
              )
            }}
          /> */}
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
        autoHide
        renderView={function renderView({ style, ...props }) {
          const viewStyle = {
            padding: '0 2rem 2rem',
          }
          return <div style={{ ...style, ...viewStyle }} {...props} />
        }}
        renderThumbVertical={renderThumbVertical}
        style={{
          height: 'calc(100vh - 10rem)',
          width: 544,
          margin: 'auto',
          borderRadius: '0.5rem',
          backgroundColor: '#1b1b1b',
        }}
      >
        <Main />
      </Scrollbars>
    </div>
  )
}
