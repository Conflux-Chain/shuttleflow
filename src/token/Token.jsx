import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import Choose from './choose/Choose.jsx'
import Caption from '../caption/Caption'
import { useTranslation } from 'react-i18next'

import back from './back.png'

import styles from './Token.module.scss'
import useIsSamll from '../component/useSmallScreen'
import useStyle from '../component/useStyle'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import MainContainer from '../component/MainContainer/MainContainer.jsx'

export function TokenNavigation({ history, location: { search }, after }) {
  const [cx] = useStyle(styles)
  const { t } = useTranslation(['token'])
  return (
    <PaddingContainer>
      <nav className={cx('nav-container')}>
        <img
          alt="back"
          className={cx('back')}
          src={back}
          onClick={() => history.goBack()}
        ></img>
        <div className={cx('nav-tabs')}>
          <div className={cx('item')}>{t('choose')}</div>
        </div>
        {after}
      </nav>
    </PaddingContainer>
  )
}

function Token(props) {
  const {
    match: { path },
  } = props
  const [cx] = useStyle(styles)
  const isSmall = useIsSamll()
  return (
    <MainContainer className={cx('container')}>
      {/* promote the navigation to top level is samll screen */}
      {!isSmall && <TokenNavigation {...props} />}
      <Switch>
        <Route exact path={path} component={Choose} />
        <Route path={`${path}/caption`} component={Caption} />
      </Switch>
    </MainContainer>
  )
}

export default React.memo(Token)
