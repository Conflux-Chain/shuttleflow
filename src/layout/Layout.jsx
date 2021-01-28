import React, { useEffect, useState, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom'
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
import Modal, { modalStyles } from '../component/Modal'
import notAllow from './not-allow.png'
import tokensList from '../data/tokenList'
import Spec from './Spec'
import { Loading } from '@cfxjs/react-ui'
const fontPromise = new Promise((resolve) => {
  document?.fonts?.ready?.then(function () {
    resolve(true)
  })
})

const root = document.getElementById('root')

export default function App() {
  const isSmall = useIsSamll()
  const [cx] = useStyle(styles, modalStyles)
  const { t } = useTranslation()
  const [block, setBlock] = useState(false)

  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (isSmall) {
      root.style.display = 'flex'
      root.style.flexDirection = 'column'
    } else {
      root.style.display = 'block'
      root.style.flexDirection = ''
    }
  }, [isSmall])

  useEffect(() => {
    //disable scroll
    document.body.style.overflow = 'hidden'
    Promise.all([fontPromise, tokensList]).then(() => {
      setStarted(true)
    })
    return subscribeNetwork((chainId) => {
      const network = NETWORKS[parseInt(chainId)]
      setBlock(
        (network === 'test' && !IS_DEV) || (network === 'main' && IS_DEV)
      )
    })
  }, [])

  // const match = useRouteMatch()
  // console.log('mm', match)
  return started ? (
    <Suspense fallback={<Loading />}>
      <RecoilRoot>
        {IS_DEV && <div className={cx('banner')}>{t('banner')}</div>}

        <Router>
          <Switch>
            <Route
              path="/:chain"
              component={isSmall ? LayoutSmall : LayoutLarge}
            ></Route>
            <Redirect to="/eth"></Redirect>
          </Switch>
        </Router>
        <Risk />
        {!isSmall && (
          <div className={cx('footer')}>
            <Spec />
          </div>
        )}

        <Modal show={block}>
          <div className={cx('not-allow')}>
            <img src={notAllow} alt={notAllow}></img>
            <div className={cx('title')}>{t('error.block')}</div>
            <div>{t(`error.switch-${!IS_DEV ? 'main' : 'test'}`)}</div>
          </div>
        </Modal>
      </RecoilRoot>
    </Suspense>
  ) : (
    <Loading size="large" />
  )
}
