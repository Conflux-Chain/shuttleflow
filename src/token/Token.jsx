import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import Choose from './choose/Choose.jsx'
import Caption from './caption/Caption'
import { useTranslation } from 'react-i18next'

import back from './back.png'

import styles from './Token.module.scss'
import MenuLink from '../component/MenuLink'
import useIsSamll from '../component/useSmallScreen'
import useStyle from '../component/useStyle'

export function TokenNavigation({ history, location: { search }, after }) {
  const [cx] = useStyle(styles)
  const { t } = useTranslation(['token'])
  //we hard code the token url here because it not bound
  //to parrent route url, i.e. it will present in either
  //top level or nested level
  const url = '/token'
  const captionUrl = `${url}/caption`
  return (
    <nav className={cx('nav-container')}>
      <img
        alt="back"
        className={cx('back')}
        src={back}
        onClick={() => history.goBack()}
      ></img>
      <div className={cx('nav-tabs')}>
        <div className={cx('item')}>{t('choose')}</div>
        {/* <MenuLink
          to={url}
          exact
          render={({ active }) => {
            return (
              <div className={cx('item', { active })}>
                <Link
                  to={{
                    pathname: url,
                    search: search,
                  }}
                >
                  {t('btn.choose-token')}
                </Link>
              </div>
            )
          }}
        /> */}
        {/* <MenuLink
          to={captionUrl}
          render={({ active }) => {
            return (
              <div
                style={{ display: 'none' }}
                className={cx('item', { active })}
              >
                <Link
                  to={{
                    pathname: captionUrl,
                    search: search,
                  }}
                >
                  {t('btn.token-caption')}
                </Link>
              </div>
            )
          }}
        /> */}
      </div>
      {after}
    </nav>
  )
}

function Token(props) {
  const {
    match: { path },
  } = props

  const isSmall = useIsSamll()
  return (
    <div>
      {/* promote the navigation to top level is samll screen */}
      {!isSmall && <TokenNavigation {...props} />}
      <Switch>
        <Route exact path={path} component={Choose} />
        <Route path={`${path}/caption`} component={Caption} />
      </Switch>
    </div>
  )
}

export default React.memo(Token)
