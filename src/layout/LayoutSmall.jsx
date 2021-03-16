import React, {
  useState,
  useRef,
  useLayoutEffect,
  Suspense,
  useEffect,
} from 'react'
import { Link, useRouteMatch, useHistory, useParams } from 'react-router-dom'
import { Loading } from '@cfxjs/react-ui'
import '../i18n/i18n'

import logo from './logo.png'
import ham from './ham.svg'
import close from './close.svg'
import up from './up.svg'

import Main from './Main'

import Accordion from '../component/Accordion'
import CHAIN_CONFIG, { CAPTAIN } from '../config/chainConfig'

import { TokenNavigation } from '../token/Token'

import layouyStyles from './LayoutSmall.module.scss'
import { useTranslation } from 'react-i18next'
import { CSSTransition } from 'react-transition-group'
import { formatAddress } from '../util/address'

import useStyle from '../component/useStyle'

import { Scrollbars } from 'react-custom-scrollbars'
import renderThumbVertical from '../component/renderThumbVertical'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import useAddress from '../data/useAddress'

export default function LayoutSmall() {
  const [cx] = useStyle(layouyStyles)
  const history = useHistory()
  const [dropdown, setDropdown] = useState(false)
  const [lngOpen, setLngOpen] = useState(false)
  const nodeRef = useRef(null)
  const headerRef = useRef(null)
  const isTokenRoute = !!useRouteMatch('/token')
  const { t, i18n } = useTranslation()
  const address = useAddress()
  const [headerHeight, setHeaderHeight] = useState(0)
  const { chain } = useParams()
  //todo: possible react bug, can not calculate dom dimention
  //correctly when Suspense present
  useLayoutEffect(() => {
    const { top, height } = headerRef.current.getBoundingClientRect()
    setHeaderHeight(top + height)
  }, [])

  useEffect(() => {
    const listener = (e) => {
      if (nodeRef.current) {
        if (!nodeRef.current.contains(e.target)) {
          setDropdown(false)
        }
      }
    }
    window.addEventListener('mousedown', listener)
    return () => {
      window.removeEventListener('mousedown', listener)
    }
  }, [nodeRef.current])
  return (
    <div className={cx('container')}>
      <div ref={headerRef}>
        <PaddingContainer>
          {isTokenRoute ? (
            <div className={cx('header')}>
              <TokenNavigation
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
              <Link to={`/${chain}`}>
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
              history.push(`/${chain}`)
              setDropdown(false)
            }}
          >
            {t('home')}
          </div>
          <div
            className={cx('item')}
            onClick={() => {
              history.push(`/${chain}/history`)
              setDropdown(false)
            }}
          >
            {t('history')}
          </div>
          <div
            className={cx('item')}
            onClick={() => {
              history.push(`/${chain}/market`)
              setDropdown(false)
            }}
          >
            {t('markets')}
          </div>
          {CHAIN_CONFIG[chain].captain !== CAPTAIN.NONE && (
            <div
              className={cx('item')}
              onClick={() => {
                history.push('/captain')
                setDropdown(false)
              }}
            >
              {t('be-captain')}
            </div>
          )}
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
