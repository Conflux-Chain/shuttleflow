import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import '../i18n/i18n'
import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import useIsSamll from '../component/useSmallScreen'
import Risk from './Risk'
import { RecoilRoot } from 'recoil'
import subscribeNetwork from '../data/subscribeNetwork'
import { IS_DEV, NETWORKS } from '../config/config'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import styles from './Layout.module.scss'

export default function App() {
  const isSmall = useIsSamll()
  const [cx] = useStyle(styles)
  const { t } = useTranslation()
  useEffect(() => {
    return subscribeNetwork((chainId) => {
      console.log('======', chainId)
    })
  }, [])

  return (
    <RecoilRoot>
      {IS_DEV && <div className={cx('banner')}>{t('aaa')}</div>}
      <Router>
        <Route path="/" component={isSmall ? LayoutSmall : LayoutLarge}></Route>
      </Router>
      <Risk />
    </RecoilRoot>
  )
}
