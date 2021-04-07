import React from 'react'
import Choose from './Choose.jsx'
import { useTranslation } from 'react-i18next'

import back from './back.png'

import styles from './Token.module.scss'
import useIsSamll from '../component/useSmallScreen'
import useStyle from '../component/useStyle'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import MainContainer from '../component/MainContainer/MainContainer.jsx'
import useUrlSearch from '../lib/useUrlSearch.js'
import { useHistory } from 'react-router'

export function TokenNavigation({ after }) {
  const [cx] = useStyle(styles)
  const history = useHistory()
  const { t } = useTranslation(['token'])
  const { next } = useUrlSearch()
  return (
    <PaddingContainer>
      <nav className={cx('nav-container')}>
        <img
          alt="back"
          className={cx('back')}
          src={back}
          onClick={() => history.push(next)}
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
  const { next, cToken, captain, chainFilter } = useUrlSearch()
  return (
    <MainContainer className={cx('container')}>
      {/* promote the navigation to top level if samll screen */}
      {!isSmall && <TokenNavigation {...props} next={next} />}
      <Choose
        next={(token) => `${next}?pair=${token}`}
        captain={captain}
        cToken={cToken}
        chainFilter={chainFilter}
      />
    </MainContainer>
  )
}

export default React.memo(Token)
