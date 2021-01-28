import React, { Suspense, useEffect, useRef, useState } from 'react'

import Main from './Main'
import logo from './logo.png'
import triangle from './triangle.svg'

import classNamesBind from 'classnames/bind'
import styles from './LayoutLarge.module.scss'
import { useTranslation } from 'react-i18next'

import Accordion from '../component/Accordion'
import UserAddress from './UserAddress'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import { Loading } from '@cfxjs/react-ui'
import pocket from '../component/pocket.png'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import CHAIN_CONFIG, { CAPTAIN } from '../config/chainConfig'

const cx = classNamesBind.bind(styles)

export default function LayoutLarge({ history }) {
  const [expandLng, setExpandLng] = useState(false)
  const [expandHelp, setExpandHelp] = useState(false)
  const { t, i18n } = useTranslation()
  const headerRef = useRef(null)
  const [mainMaxHeight, setMainMaxHeight] = useState(0)

  useEffect(() => {
    const { bottom } = headerRef.current.getBoundingClientRect()
    let { marginBottom } = getComputedStyle(headerRef.current)
    marginBottom = parseFloat(marginBottom.replace('px', ''))
    const { innerHeight } = window
    setMainMaxHeight(innerHeight - bottom - marginBottom - 40)
  }, [])

  const { chain } = useParams()
  const chainRoot = `/${chain}`
  return (
    <>
      <header ref={headerRef} className={cx('header')}>
        <img
          className={cx('logo')}
          alt="home"
          onClick={() => history.push(chainRoot)}
          src={logo}
        ></img>

        <div className={cx('right')}>
          <UserAddress />
          <LinkItem
            to={`${chainRoot}/shuttle/in`}
            alsoMatch={[`${chainRoot}/shuttle/out`]}
            content={t('home')}
            history={history}
          />
          <LinkItem
            to={`${chainRoot}/history`}
            content={t('history')}
            history={history}
          />
          <LinkItem
            to={`${chainRoot}/market`}
            content={t('markets')}
            history={history}
          />

          <Accordion
            contentStyle={{ position: 'absolute', top: '5rem' }}
            clickAway={() => setExpandHelp(false)}
            expanded={expandHelp}
            title={
              <div
                onClick={() => {
                  setExpandHelp((x) => {
                    return !x
                  })
                }}
                className={cx('item')}
              >
                {t('help')}
              </div>
            }
            content={
              <div className={cx('dropdown-container')}>
                {[
                  [t('what-sf'), t('what-sf-link')],
                  [t('what-captain'), t('what-captain-link')],
                ].map(([txt, link]) => {
                  return (
                    <div
                      key={txt}
                      onClick={() => {
                        window.open(link, '_blank')
                      }}
                      className={cx('lng-item')}
                    >
                      {txt}
                    </div>
                  )
                })}
              </div>
            }
          />

          {CHAIN_CONFIG[chain].captain !== CAPTAIN.NONE && (
            <LinkItem
              to={`${chainRoot}/captain`}
              content={
                <div className={cx('captain')}>
                  <img className={cx('pocket')} src={pocket} alt="pocket"></img>
                  {t('be-captain')}
                </div>
              }
              history={history}
            />
          )}

          <Accordion
            contentStyle={{ position: 'absolute', right: '2rem', top: '5rem' }}
            clickAway={() => setExpandLng(false)}
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
                <span style={{ whiteSpace: 'nowrap' }}>
                  {i18n.language === 'zh' ? '中文' : 'English'}
                </span>
                <img
                  alt="up"
                  className={cx('up', { 'icon-active': !expandLng })}
                  src={triangle}
                ></img>
              </div>
            }
            content={
              <div className={cx('dropdown-container')}>
                {['en', 'zh'].map((lng) => {
                  return (
                    <div
                      key={lng}
                      onClick={() => {
                        i18n.changeLanguage(lng)
                        setExpandLng(false)
                      }}
                      className={cx('lng-item', {
                        selected: i18n.language === lng,
                      })}
                    >
                      {lng === 'en' ? 'English' : '中文'}
                    </div>
                  )
                })}
              </div>
            }
          ></Accordion>
        </div>
      </header>
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  )
}

function LinkItem({ to, content, alsoMatch = [] }) {
  return (
    <NavLink
      to={to}
      isActive={(_, location) => {
        const { search, pathname } = location
        const next = new URLSearchParams(search).get('next')
        let match = [...alsoMatch, to].some((x) => x === pathname)
        let matchSearch = [...alsoMatch, to].some((x) => x === next)
        return match || matchSearch
      }}
      className={cx('item')}
      activeClassName={cx('active')}
    >
      {content}
    </NavLink>
    // <MenuLink
    //   to={match || to}
    //   render={({ active }) => {
    //     return (
    //       <div
    //         onClick={() => history.push(to)}
    //         className={cx('item', { active })}
    //       >
    //         {content}
    //       </div>
    //     )
    //   }}
    // />
  )
}
