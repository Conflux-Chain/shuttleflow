import React, { useEffect, useState, Suspense } from 'react'
import '../i18n/i18n'
import useIsSamll from '../component/useSmallScreen'

import { RecoilRoot } from 'recoil'
import subscribeNetwork from '../data/subscribeNetwork'
import { IS_DEV, NETWORKS } from '../config/config'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import styles from './Layout.module.scss'
import Modal from '../component/Modal'
import notAllow from './not-allow.png'
import { Loading } from '@cfxjs/react-ui'
import RouterRoot from './RouterRoot'
import PrepareData from './PrepareData'
import { SWRConfig } from 'swr'
import GlobalPopup from '../globalPopup/globalPopup'

const root = document.getElementById('root')

//Make sure the user have a old portal
//Can not draw the conclusion when ConfluxJSSDK not present
const portalBlock = window.ConfluxJSSDK
  ? !window.ConfluxJSSDK?.format?.hexAddress
  : false
export default function App() {
  const isSmall = useIsSamll()
  const [cx] = useStyle(styles)
  const { t } = useTranslation()
  const [networkBlock, setNetworkBlock] = useState(false)

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
      setNetworkBlock(
        (network === 'test' && !IS_DEV) || (network === 'main' && IS_DEV)
      )
    })
  }, [])

  return (
    <Suspense fallback={<Loading />}>
      <RecoilRoot>
        <PrepareData>
          {IS_DEV && <div className={cx('banner')}>{t('banner')}</div>}
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateOnMount: false,
              revalidateOnReconnect: false,
              refreshWhenOffline: false,
              refreshWhenHidden: false,
              refreshInterval: 10000000000,
            }}
          >
            <RouterRoot />
          </SWRConfig>

          <Modal show={networkBlock || portalBlock}>
            <div className={cx('not-allow')}>
              <img src={notAllow} alt={notAllow}></img>
              <div className={cx('title')}>
                {t(portalBlock ? 'error.block-portal-title' : 'error.block')}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  // whiteSpace: 'nowrap',
                }}
              >
                {portalBlock ? (
                  <>
                    {t('error.block-portal-content')}
                    <a
                      style={{ color: '#00d2af', textDecoration: 'underline' }}
                      href="https://portal.conflux-chain.org/"
                      target="_blank"
                    >
                      {t('error.block-portal-update')}
                    </a>
                  </>
                ) : (
                  t(`error.switch-${!IS_DEV ? 'main' : 'test'}`)
                )}
              </div>
            </div>
          </Modal>
          <GlobalPopup />
        </PrepareData>
      </RecoilRoot>
    </Suspense>
  )
}
