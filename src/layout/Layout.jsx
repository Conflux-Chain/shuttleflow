import React, { useEffect, useState, Suspense } from 'react'
import '../i18n/i18n'
import useIsSamll from '../component/useSmallScreen'
import Risk from './Risk'
import { RecoilRoot } from 'recoil'
import subscribeNetwork from '../data/subscribeNetwork'
import { IS_DEV, NETWORKS } from '../config/config'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import styles from './Layout.module.scss'
import Modal from '../component/Modal'
import notAllow from './not-allow.png'
import Spec from './Spec'
import { Loading } from '@cfxjs/react-ui'
import RouterRoot from './RouterRoot'
import wrapPromise from '../lib/wrapPromise'

const root = document.getElementById('root')

export default function App() {
  const isSmall = useIsSamll()
  const [cx] = useStyle(styles)
  const { t } = useTranslation()
  const [block, setBlock] = useState(false)

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
    return subscribeNetwork((chainId) => {
      const network = NETWORKS[parseInt(chainId)]
      setBlock(
        (network === 'test' && !IS_DEV) || (network === 'main' && IS_DEV)
      )
    })
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <RecoilRoot>
        <MakeSureFont>
          {IS_DEV && <div className={cx('banner')}>{t('banner')}</div>}
          <RouterRoot />
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
        </MakeSureFont>
      </RecoilRoot>
    </Suspense>
  )
}

const waitFont = wrapPromise(
  new Promise((resolve) => {
    const ready = document?.fonts?.ready
    if (!ready) {
      resolve(true)
    } else {
      ready.then(function (v) {
        resolve(true)
      })
    }
  })
)
function MakeSureFont({ children }) {
  waitFont()
  return children
}
