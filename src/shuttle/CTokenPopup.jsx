import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import ctokenStyles from './CTokenPopup.module.scss'
import Modal from '../component/Modal'
import modalStyles from '../component/modal.module.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import copyDark from './shuttle-in/i-copy-dark-48.png'

export default function CTokenPopup({
  displaySymbol,
  address,
  cTokenPopup,
  setCTokenPopup,
  chain,
  chainTool,
  // tokenInfo,
  displayCopy,
}) {
  const [cTokenCx, modalCx] = useStyle(ctokenStyles, modalStyles)
  const { t } = useTranslation('shuttle')

  return (
    <Modal
      show={cTokenPopup}
      title
      onClose={() => setCTokenPopup(false)}
      clickAway={() => setCTokenPopup(false)}
    >
      <div className={modalCx('content')}>
        {t('popup-token', { chain, chainTool })}
      </div>
      <div className={cTokenCx('ctoken')}>
        <div className={cTokenCx('contract-address')}>
          {t('popup-contract', { symbol: displaySymbol })}
        </div>
        <div className={cTokenCx('ctoken-copy')}>
          <div className={cTokenCx('popup-address')}>{address}</div>
          <div className={cTokenCx('bar')}></div>
          <CopyToClipboard
            text={address}
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
