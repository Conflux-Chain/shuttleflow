import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  Suspense,
} from 'react'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import { Loading } from '@cfxjs/react-ui'
import '../i18n/i18n'

import logo from './logo.png'
import ham from './ham.svg'
import close from './close.svg'
import up from './up.svg'

import Main from './Main'

import Accordion from '../component/Accordion'

import { TokenNavigation } from '../token/Token'

import layouyStyles from './LayoutSmall.module.scss'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import formatAddress from '../component/formatAddress'

import useStyle from '../component/useStyle'

import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'

export default function LayoutSmall(props) {
  const [cx] = useStyle(layouyStyles)
  const history = useHistory()
  const [dropdown, setDropdown] = useState(false)
  const [lngOpen, setLngOpen] = useState(false)
  const nodeRef = useRef(null)
  const headerRef = useRef(null)
  const isTokenRoute = !!useRouteMatch('/token')
  const { t, i18n } = useTranslation()
  const { address } = useConfluxPortal()
  const [headerHeight, setHeaderHeight] = useState(0)
  //todo: possible react bug, can not calculate dom dimention
  //correctly when Suspense present
  useLayoutEffect(() => {
    const { top, height } = headerRef.current.getBoundingClientRect()
    setHeaderHeight(top + height)
  }, [])
  return (
    <div className={cx('container')}>
      <div ref={headerRef}>
        <PaddingContainer>
          {isTokenRoute ? (
            <div className={cx('header')}>
              <TokenNavigation
                {...props}
                after={
                  <img
                    alt="ham"
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
                <img alt="logo" className={cx('logo')} src={logo}></img>
              </Link>
              <div className={cx('right')}>
                <span>{formatAddress(address)}</span>
                <img
                  alt="ham"
                  className={cx('ham')}
                  src={dropdown ? close : ham}
                  onClick={() => {
                    setDropdown((x) => !x)
                  }}
                ></img>
              </div>
            </header>
          )}
        </PaddingContainer>
      </div>

      {/* todo: an absolutely position without a top do not work
      as static anymore? caused by my misunderstanding or updated 
      spec??
      */}
      <CSSTransition
        nodeRef={nodeRef}
        style={{ top: headerHeight }}
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
          <div
            className={cx('item')}
            onClick={() => {
              history.push('/history')
              setDropdown(false)
            }}
          >
            {t('history')}
          </div>
          <div
            className={cx('item')}
            onClick={() => {
              history.push('/market')
              setDropdown(false)
            }}
          >
            {t('markets')}
          </div>
          <div
            className={cx('item')}
            onClick={() => {
              history.push('/caption')
              setDropdown(false)
            }}
          >
            {t('be-caption')}
          </div>
          <Accordion
            expanded={lngOpen}
            title={
              <div
                onClick={() => {
                  setLngOpen((x) => !x)
                }}
                className={cx('item')}
                style={{ position: 'relative' }}
              >
                <span>{t('choose-lng')}</span>
                <img
                  className={cx('up', { lngOpen: !lngOpen })}
                  src={up}
                  alt="up"
                ></img>
              </div>
            }
            content={
              <div>
                <div
                  onClick={() => {
                    setDropdown(false)
                    setLngOpen(false)
                    i18n.changeLanguage('zh')
                  }}
                  className={cx('item', 'lng-item')}
                >
                  中文
                </div>
                <div
                  onClick={() => {
                    setDropdown(false)
                    setLngOpen(false)
                    i18n.changeLanguage('en')
                  }}
                  className={cx('item', 'lng-item')}
                >
                  English
                </div>
              </div>
            }
          />
        </nav>
      </CSSTransition>
      <Suspense fallback={<Loading />}>
        <Scrollbars
          renderThumbVertical={renderThumbVertical}
          style={{
            flex: 1,
            margin: 'auto',
            borderRadius: '0.5rem',
          }}
        >
          <Main />
        </Scrollbars>
      </Suspense>
    </div>
  )
}
