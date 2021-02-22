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

import tickSrc from './tick.svg'
import tickSolidSrc from './tick-solid.svg'

import CHAIN_CONFIG, { CAPTAIN } from '../config/chainConfig'
import { useHistory } from 'react-router-dom'
import icons from '../data/tokenIcons'
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
          <Select
            type="chain"
            icon
            setCurrent={(v) => history.push(`/${v}`)}
            render={renderChainSelect}
            current={chain}
            dropdownTitle={t('choose-chain')}
            options={['btc', 'eth'].map((key) => {
              return {
                key,
                value: key,
              }
            })}
          />
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
      activeClassName={cx('active')}
    >
      {content}
    </NavLink>
  )
}

function Select({
  current,
  options,
  setCurrent,
  title,
  border,
  icon,
  right,
  type,
  dropdownTitle,
  render,
}) {
  const [expand, setExpand] = useState(false)
  const currentOption = options.find((x) => x.key === current)

  return (
    <Accordion
      contentStyle={{ position: 'absolute', top: '5rem', ...{ right } }}
      clickAway={() => setExpand(false)}
      expanded={expand}
      title={
        <div
          className={cx('select-title', 'item', { border })}
          onClick={() => {
            setExpand((x) => {
              return !x
            })
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>
            {title ||
              (render
                ? render({
                    key: (currentOption || options[0]).value,
                    title: true,
                  })
                : (currentOption || options[0]).value)}
          </span>
          {icon && (
            <img
              alt="up"
              className={cx('up', { 'icon-active': expand })}
              src={triangle}
            ></img>
          )}
        </div>
      }
      content={
        <div className={cx('dropdown-container')}>
          {dropdownTitle ? (
            <div className={cx('dropdown-title')}>{dropdownTitle}</div>
          ) : null}
          {options.map(({ key, value }, i) => {
            const selected = key && current && key === current
            return (
              <div
                key={i}
                onClick={() => {
                  if (setCurrent) {
                    setCurrent(key)
                  }
                  setExpand(false)
                }}
                className={cx('dropdown-item', type, {
                  selected,
                })}
              >
                {render ? render({ key }) : value}
                {selected && (
                  <img
                    className={cx('after')}
                    alt="tick"
                    src={type === 'lng' ? tickSrc : tickSolidSrc}
                  ></img>
                )}
              </div>
            )
          })}
        </div>
      }
    ></Accordion>
  )
}

function renderChainSelect({ key, title }) {
  return (
    <div
      style={{
        marginRight: title ? '' : '1rem',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
        src={icons[key]}
        alt="icon"
      ></img>
      <span
        style={{ color: title ? 'white' : '#333333', marginRight: '0.2rem' }}
      >
        {key.toUpperCase()}
      </span>{' '}
      <span
        style={{ color: title ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
      >
        {' /Conflux'}
      </span>
    </div>
  )
}