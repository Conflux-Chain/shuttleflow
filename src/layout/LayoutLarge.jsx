import React, { useCallback, useState } from 'react'
import { useConfluxPortal } from '@cfxjs/react-hooks'

import Main from './Main'
import logo from './logo.svg'
import triangle from './triangle.svg'

import classNamesBind from 'classnames/bind'
import styles from './LayoutLarge.module.scss'
import MenuLink from '../component/MenuLink'
import { useTranslation } from 'react-i18next'
import formatAddress from '../component/formatAddress'
import Accordion from '../component/Accordion'

const cx = classNamesBind.bind(styles)

export default function LayoutLarge({ history }) {
  // const address = 'sqdergtyju7'
  const {
    address,
  } = useConfluxPortal()
  const [expandLng, setExpandLng] = useState(false)
  const { t, i18n } = useTranslation()
  const clickAway = useCallback(() => {
    setExpandLng(false)
  }, [])

  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <img alt="home" onClick={() => history.push('/')} src={logo}></img>

        <div className={cx('right')}>
          <span className={cx('address')}>
            {address ? formatAddress(address) : ''}
          </span>
          <MenuLink
            to="/history"
            render={({ active }) => {
              return (
                <div
                  onClick={() => history.push('/history')}
                  className={cx('item', { active })}
                >
                  {t('btn.history')}
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
                  {t('btn.markets')}
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
                  {t('btn.be-caption')}
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
      <div className={cx('main')}>
        <Main />
      </div>
    </div>
  )
}
