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
            border
            icon
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
      activeClassName={cx('active')}
    >
      {content}
    </NavLink>
  )
}

function Select({ current, options, setCurrent, title, border, icon }) {
  const [expand, setExpand] = useState(false)
  const currentOption = options.find((x) => x.key === current)
  return (
    <Accordion
      contentStyle={{ position: 'absolute', top: '5rem' }}
      clickAway={() => setExpand(false)}
      expanded={expand}
      title={
        <div
          className={cx('lng', { border })}
          onClick={() => {
            setExpand((x) => {
              return !x
            })
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            {title || (currentOption || options[0]).value}
          </span>
          {icon && (
            <img
              alt="up"
              className={cx('up', { 'icon-active': !expand })}
              src={triangle}
            ></img>
          )}
        </div>
      }
      content={
        <div className={cx('dropdown-container')}>
          {options.map(({ key, value }, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  if (setCurrent) {
                    setCurrent(key)
                  }
                  setExpand(false)
                }}
                className={cx('lng-item', {
                  selected: key && current && key === current,
                })}
              >
                {value}
              </div>
            )
          })}
        </div>
      }
    ></Accordion>
  )
}
