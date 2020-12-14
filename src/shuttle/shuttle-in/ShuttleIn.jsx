import React, { useCallback, useState } from 'react'

import { useTranslation, Trans } from 'react-i18next'
import QRCode from 'qrcode.react'

import down from '../down.svg'
import copy from './i-copy-48.png'

import tick from './tick.svg'
import qr from './qr.svg'
import question from '../../component/question.svg'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Modal from '../../component/Modal'
import modalStyles from '../../component/modal.module.scss'
import ShuttleHistory from '../../history/ShuttleHistory'

import useStyle from '../../component/useStyle'
import commonInputStyles from '../../component/input.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'
import useShuttleInAddress from '../../data/useShuttleInAddress'
import TokenInput from '../TokenInput'

import CTokenPopup from '../CTokenPopup'

export default function ShuttleIn({ tokenInfo, next }) {
  const [commonCx, shuttleCx, shuttleInCx, modalCx] = useStyle(
    commonInputStyles,
    shuttleStyle,
    shuttleInStyles,
    modalStyles
  )
  const { t } = useTranslation('shuttle-in')
  const shuttleInAddress = useShuttleInAddress(tokenInfo)

  const [addressPopup, setAddressPopup] = useState(false)
  const [cTokenPopup, setCTokenPopup] = useState(false)
  const [minPopup, setMinPopup] = useState(false)
  const [feePopup, setFeePopup] = useState(false)
  const [copyPopup, setCopyPopup] = useState(false)
  const [qrPopup, setQrPopup] = useState(false)

  const displayCopy = useCallback(() => {
    setCopyPopup(true)
    const tm = setTimeout(() => setCopyPopup(false), 2000)
    return () => {
      clearTimeout(tm)
    }
  }, [])

  return (
    <div className={shuttleInCx('container')}>
      <TokenInput
        to={{
          pathname: '/token',
          search: `?next=${next}`,
        }}
        tokenInfo={tokenInfo}
        placeholder={t('placeholder.out')}
      />
      <div className={shuttleCx('down')}>
        <img alt="down" src={down}></img>
      </div>
      <TokenInput
        to={{
          pathname: '/token',
          search: `?next=${next}&cToken=1`,
        }}
        tokenInfo={tokenInfo}
        placeholder={t('common:placeholder.in')}
        cToken={() => setCTokenPopup(true)}
      />

      {tokenInfo && (
        <p className={shuttleCx('small-text')}>
          <span style={{ display: 'flex' }}>
            <span>{t('amount', tokenInfo)}</span>
            <img alt="?" onClick={() => setMinPopup(true)} src={question}></img>
          </span>

          <span style={{ display: 'flex' }}>
            <span>{t('fee', tokenInfo)}</span>
            <img alt="?" onClick={() => setFeePopup(true)} src={question}></img>
          </span>
        </p>
      )}

      <div className={shuttleInCx('address')}>
        <div className={shuttleCx('title', 'with-question')}>
          <span>{t('address')}</span>
          <img
            alt="?"
            onClick={() => {
              setAddressPopup(true)
            }}
            src={question}
          ></img>
        </div>

        <div className={shuttleInCx('address-input')}>
          <input
            readOnly
            defaultValue={shuttleInAddress}
            className={
              commonCx('input-common') + ' ' + shuttleInCx('input-address')
            }
            placeholder={t('address-placeholder')}
          />
          {shuttleInAddress && (
            <CopyToClipboard text={shuttleInAddress} onCopy={displayCopy}>
              <img alt="copy" className={shuttleInCx('copy')} src={copy}></img>
            </CopyToClipboard>
          )}
        </div>
      </div>
      {tokenInfo && (
        <p
          style={{ alignItems: 'flex-start' }}
          className={shuttleCx('small-text')}
        >
          <span>
            <Trans
              t={t}
              i18nKey="latest"
              values={{
                type: t(tokenInfo.reference === 'btc' ? 'btc' : 'eth'),
              }}
            ></Trans>
          </span>

          <span
            className={shuttleInCx('qr-container')}
            onClick={() => setQrPopup(true)}
          >
            <img style={{ marginRight: '1rem' }} alt="qr" src={qr}></img>
            <span>{t('qr')}</span>
          </span>
        </p>
      )}
      <ShuttleHistory type="mint" />
      <Modal
        show={addressPopup}
        title
        onClose={() => setAddressPopup(false)}
        clickAway={() => setAddressPopup(false)}
      >
        <div className={modalCx('content')}>{t('popup.address')}</div>
        <div className={modalCx('btn')} onClick={() => setAddressPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <CTokenPopup
        displayCopy={displayCopy}
        cTokenPopup={cTokenPopup}
        setCTokenPopup={setCTokenPopup}
        tokenInfo={tokenInfo}
      />
      <Modal
        show={feePopup}
        title
        onClose={() => setFeePopup(false)}
        clickAway={() => setFeePopup(false)}
      >
        <div className={modalCx('content')}>
          <Trans values={tokenInfo} t={t} i18nKey="popup.fee"></Trans>
        </div>
        <div className={modalCx('btn')} onClick={() => setFeePopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal
        show={minPopup}
        title
        onClose={() => setMinPopup(false)}
        clickAway={() => setMinPopup(false)}
      >
        <div className={modalCx('content')}>{t('popup.min')}</div>
        <div className={modalCx('btn')} onClick={() => setMinPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal
        show={copyPopup}
        clickAway={() => {
          setCopyPopup(false)
        }}
      >
        <div className={shuttleInCx('copy-popup')}>
          <img alt="tick" src={tick}></img>
          <div>{t('popup.copy')}</div>
        </div>
      </Modal>

      <Modal
        onClose={() => setQrPopup(false)}
        show={qrPopup}
        clickAway={() => setQrPopup(false)}
      >
        <div>
          <div className={modalCx('title')}>{t('popup.in-address')}</div>
          <div className={shuttleInCx('qr-popup')}>
            <div className={shuttleInCx('code')}>
              <QRCode value={shuttleInAddress} />
            </div>
            <div>{shuttleInAddress}</div>
            <CopyToClipboard text={shuttleInAddress}>
              <div onClick={displayCopy} className={modalCx('btn')}>
                {t('copy-address')}
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </Modal>
    </div>
  )
}
