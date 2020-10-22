import React, { useRef, useState } from 'react'

import { useTranslation, Trans } from 'react-i18next'
import QRCode from 'qrcode.react'

import down from '../down.svg'
import copy from './copy.svg'
import tick from './tick.svg'
import qr from './qr.svg'
import question from '../../component/question.svg'

import Modal from '../../component/Modal'
import modalStyles from '../../component/modal.module.scss'
import ShuttleHistory from '../../history/ShuttleHistory'

import useStyle from '../../component/useStyle'
import commonInputStyles from '../../component/input.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'
import useShuttleInAddress from '../../data/useShuttleInAddress'
import useTokenList from '../../data/useTokenList'

import Input from '../Input'

export default function ShuttleIn({ location: { search }, match: { url } }) {
  const [commonCx, shuttleCx, shuttleInCx, modalCx] = useStyle(
    commonInputStyles,
    shuttleStyle,
    shuttleInStyles,
    modalStyles
  )
  const urlToken = new URLSearchParams(search).get('token')
  const { tokens } = useTokenList(urlToken)
  //display tokenInfo only when token is url available
  const tokenInfo = urlToken && tokens ? tokens[0] : null
  const { t } = useTranslation('shuttle-in')

  let address = useShuttleInAddress(tokenInfo)
  if (address) {
    address = address.toLocaleLowerCase()
  }

  const [addressPopup, setAddressPopup] = useState(false)
  const [cTokenPopup, setCTokenPopup] = useState(false)
  const [minPopup, setMinPopup] = useState(false)
  const [feePopup, setFeePopup] = useState(false)
  const [copyPopup, setCopyPopup] = useState(false)
  const [qrPopup, setQrPopup] = useState(false)

  //useful for copying
  const copyInputRef = useRef(null)
  const popupCopyRef = useRef(null)

  return (
    <div className={shuttleInCx('container')}>
      <Input
        to={{
          pathname: '/token',
          search: `?next=${url}`,
        }}
        tokenInfo={tokenInfo}
        defaultValue={tokenInfo?.reference_symbol}
        placeholder={t('placeholder.out')}
        icon={tokenInfo?.icon}
      />
      <div className={shuttleCx('down')}>
        <img alt="down" src={down}></img>
      </div>
      <Input
        to={{
          pathname: '/token',
          search: `?next=${url}&cToken=1`,
        }}
        tokenInfo={tokenInfo}
        defaultValue={tokenInfo?.symbol}
        placeholder={t('common:placeholder.in')}
        icon={tokenInfo?.icon}
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
            ref={copyInputRef}
            readOnly
            defaultValue={address}
            className={commonCx('input-common')}
            placeholder={t('address-placeholder')}
          />
          {tokenInfo && (
            <img
              alt="copy"
              className={shuttleInCx('copy')}
              src={copy}
              onClick={() => {
                copyInputRef.current.select()
                copyInputRef.current.setSelectionRange(
                  0,
                  99999
                ) /*For mobile devices*/
                document.execCommand('copy')
                setCopyPopup(true)
              }}
            ></img>
          )}
        </div>
      </div>
      {tokenInfo && (
        <p className={shuttleCx('small-text')}>
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
            onClick={() => setQrPopup(true)}
            style={{ display: 'flex', cursor: 'pointer' }}
          >
            <img style={{ marginRight: '1rem' }} alt="qr" src={qr}></img>
            <span>{t('qr')}</span>
          </span>
        </p>
      )}
      <ShuttleHistory type="mint" />
      <Modal show={addressPopup} title clickAway={() => setAddressPopup(false)}>
        <div className={modalCx('content')}>{t('popup.address')}</div>
        <div className={modalCx('btn')} onClick={() => setAddressPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={cTokenPopup} title clickAway={() => setCTokenPopup(false)}>
        <div className={modalCx('content')}>{t('popup.ctoken')}</div>
        <div className={shuttleInCx('ctoken')}>
          <div className={shuttleInCx('contract-address')}>
            {t('popup.contract', tokenInfo)}
          </div>
          <div className={shuttleInCx('ctoken-copy')}>
            <input
              ref={popupCopyRef}
              value={address}
              readOnly
              className={shuttleInCx('popup-address')}
            ></input>
            <div className={shuttleInCx('bar')}></div>
            <img
              className={shuttleInCx('popup-copy')}
              src={copy}
              alt="copy"
              onClick={() => {
                popupCopyRef.current.select()
                popupCopyRef.current.setSelectionRange(
                  0,
                  99999
                ) /*For mobile devices*/
                document.execCommand('copy')
                setCTokenPopup(false)
                setCopyPopup(true)
              }}
            ></img>
          </div>
        </div>

        <div className={modalCx('btn')} onClick={() => setCTokenPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={feePopup} title clickAway={() => setFeePopup(false)}>
        <div className={modalCx('content')}>
          <Trans values={tokenInfo} t={t} i18nKey="popup.fee"></Trans>
        </div>
        <div className={modalCx('btn')} onClick={() => setFeePopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={minPopup} title clickAway={() => setMinPopup(false)}>
        <div className={modalCx('content')}>{t('popup.min')}</div>
        <div className={modalCx('btn')} onClick={() => setMinPopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
      <Modal show={copyPopup} clickAway={() => setCopyPopup(false)}>
        <div className={shuttleInCx('copy-popup')}>
          <img alt="tick" src={tick}></img>
          <div>{t('popup.copy')}</div>
        </div>
      </Modal>

      <Modal show={qrPopup} clickAway={() => setQrPopup(false)}>
        <div>
          <div className={modalCx('title')}>{t('popup.in-address')}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '1.5rem',
            }}
          >
            <QRCode value={address} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
