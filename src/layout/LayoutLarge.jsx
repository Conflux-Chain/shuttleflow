import React, { Suspense, useEffect, useRef, useState } from 'react'

import Main from './Main'
import logo from './logo.png'

import classNamesBind from 'classnames/bind'
import styles from './LayoutLarge.module.scss'
import { useTranslation } from 'react-i18next'

import UserAddress from './UserAddress'
import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import { Loading } from '@cfxjs/react-ui'
import pocket from '../component/pocket.png'
import { useParams } from 'react-router'
import { NavLink } from 'react-router-dom'

import CHAIN_CONFIG, { CAPTAIN } from '../config/chainConfig'
import { useHistory } from 'react-router-dom'
import ChooseChain from './ChooseChain'
import Select from './Select'
const cx = classNamesBind.bind(styles)

export default function LayoutLarge() {
  const { t, i18n } = useTranslation()
  const headerRef = useRef(null)
  const [mainMaxHeight, setMainMaxHeight] = useState(0)
  const history = useHistory()

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
        <div className={cx('left')}>
          <img
            className={cx('logo')}
            alt="home"
            onClick={() => history.push(chainRoot)}
            src={logo}
          ></img>
          <ChooseChain />
        </div>
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

          <Select
            title={t('help')}
            options={[
              [t('what-sf'), t('what-sf-link')],
              [t('what-captain'), t('what-captain-link')],
            ].map(([txt, link]) => {
              return {
                value: (
                  <div
                    key={txt}
                    onClick={() => {
                      window.open(link, '_blank')
                    }}
                  >
                    {txt}
                  </div>
                ),
              }
            })}
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
          <Select
            right="0"
            border
            icon
            type="lng"
            current={i18n.language}
            options={[
              { key: 'en', value: 'English' },
              { key: 'zh', value: '中文' },
            ]}
            setCurrent={i18n.changeLanguage.bind(i18n)}
          />
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
      // id={to}
      activeClassName={cx('active')}
    >
      {content}
    </NavLink>
  )
}
