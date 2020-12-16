import React from 'react'
import Choose from './Choose.jsx'
import { useTranslation } from 'react-i18next'

import back from './back.png'

import styles from './Token.module.scss'
import useIsSamll from '../component/useSmallScreen'
import useStyle from '../component/useStyle'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import MainContainer from '../component/MainContainer/MainContainer.jsx'
import useUrlSearch from '../data/useUrlSearch.js'
import { useHistory } from 'react-router-dom'
import { buildSearch } from '../component/urlSearch.js'

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
  const [cx] = useStyle(styles)
  const isSmall = useIsSamll()
  const { t } = useTranslation(['token'])
  const { next, cToken, ...extra } = useUrlSearch()
  const { token } = extra
  const history = useHistory()
  return (
    <MainContainer className={cx('container')}>
      {/* promote the navigation to top level is samll screen */}
      {!isSmall && <TokenNavigation {...props} />}
      <Choose {...extra} next={next} cToken={cToken} />
      <div
        onClick={() => {
          window.open(`/caption${token ? `?token=${token}` : ''}`, '_blank')
        }}
      >
        {t('caption-benefit')}
      </div>
    </MainContainer>
  )
}

export default React.memo(Token)
