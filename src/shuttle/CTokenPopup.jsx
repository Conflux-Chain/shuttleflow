import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import ctokenStyles from './CTokenPopup.module.scss'
import Modal from '../component/Modal'
import modalStyles from '../component/modal.module.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import copyDark from './shuttle-in/i-copy-dark-48.png'

export default function CTokenPopup({
  cTokenPopup,
  setCTokenPopup,
  tokenInfo,
  displayCopy
}) {
  const [cTokenCx, modalCx] = useStyle(ctokenStyles, modalStyles)
  const { t } = useTranslation('shuttle-in')
  return (
    <Modal
      show={cTokenPopup}
      title
      onClose={() => setCTokenPopup(false)}
      clickAway={() => setCTokenPopup(false)}
    >
      <div className={modalCx('content')}>{t('popup.ctoken')}</div>
      <div className={cTokenCx('ctoken')}>
        <div className={cTokenCx('contract-address')}>
          {t('popup.contract', tokenInfo)}
        </div>
        <div className={cTokenCx('ctoken-copy')}>
          <div className={cTokenCx('popup-address')}>
            {tokenInfo && tokenInfo.ctoken}
          </div>
          <div className={cTokenCx('bar')}></div>
          <CopyToClipboard
            text={tokenInfo && tokenInfo.ctoken}
            onCopy={() => {
                displayCopy()
            }}
          >
            <img
              className={cTokenCx('popup-copy')}
              src={copyDark}
              alt="copy"
            ></img>
          </CopyToClipboard>
        </div>
      </div>

      <div className={modalCx('btn')} onClick={() => setCTokenPopup(false)}>
        {t('popup.ok')}
      </div>
    </Modal>
  )
}
