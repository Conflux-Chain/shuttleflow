import React, { useCallback, useState } from 'react'

import { useTranslation, Trans } from 'react-i18next'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import down from '../down.svg'
import copy from './i-copy-48.png'

import tick from './tick.svg'
import qr from './qr.svg'

import Modal, { modalStyles } from '../../component/Modal'

import ShuttleHistory from '../../history/ShuttleHistory'

import useStyle from '../../component/useStyle'
import commonInputStyles from '../../component/input.module.scss'
import shuttleStyle from '../Shuttle.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'
import useShuttleAddress from '../../data/useShuttleInAddress'
import TokenInput from '../TokenInput'

import WithQuestion from '../../component/WithQuestion'
import { Loading } from '@cfxjs/react-ui'
import { useParams } from 'react-router'

export default function ShuttleIn({ tokenInfo }) {
  const [commonCx, shuttleCx, shuttleInCx, modalCx] = useStyle(
    commonInputStyles,
    shuttleStyle,
    shuttleInStyles,
    modalStyles
  )
  const { t } = useTranslation(['shuttle-in', 'shuttle'])
  const [addressPopup, setAddressPopup] = useState(false)
  // const [cTokenPopup, setCTokenPopup] = useState(false)
  const [minPopup, setMinPopup] = useState(false)

  const [copyPopup, setCopyPopup] = useState(false)

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
        tokenInfo={tokenInfo}
        dir="from"
        placeholder={t('placeholder.out')}
        displayCopy={displayCopy}
      />
      <div className={shuttleCx('down')}>
        <img alt="down" src={down}></img>
      </div>
      <TokenInput
        dir="to"
        tokenInfo={tokenInfo}
        placeholder={t('placeholder.in')}
        displayCopy={displayCopy}
        cToken
      />

      {tokenInfo && (
        <TokenInfoDetails
          {...{
            shuttleCx,
            setMinPopup,
            tokenInfo,
            shuttleInCx,
            t,
            modalCx,
            commonCx,
            setAddressPopup,
            displayCopy,
          }}
        />
      )}
      <ShuttleHistory type="in" />
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
    </div>
  )
}

function TokenInfoDetails({
  shuttleCx,
  commonCx,
  modalCx,
  shuttleInCx,
  t,
  setMinPopup,
  setAddressPopup,
  displayCopy,
  tokenInfo,
}) {
  const { origin } = tokenInfo
  const { chain } = useParams()
  const [feePopup, setFeePopup] = useState(false)
  const [qrPopup, setQrPopup] = useState(false)
  const shuttleInAddress = useShuttleAddress({ type: 'in', origin })
  return (
    <>
      <div className={shuttleCx('small-text')}>
        <WithQuestion onClick={() => setMinPopup(true)}>
          <span>{t('amount', tokenInfo)}</span>
        </WithQuestion>

        <WithQuestion onClick={() => setFeePopup(true)}>
          <span>{t('fee', tokenInfo)}</span>
        </WithQuestion>
      </div>

      <div className={shuttleInCx('address')}>
        <WithQuestion
          className={shuttleCx('title')}
          onClick={() => setAddressPopup(true)}
        >
          <span>{t('address')}</span>
        </WithQuestion>

        <div className={shuttleInCx('address-input')}>
          <input
            readOnly
            defaultValue={shuttleInAddress}
            className={
              commonCx('input-common') + ' ' + shuttleInCx('input-address')
            }
            placeholder={t('address-placeholder')}
          />
          {shuttleInAddress ? (
            <CopyToClipboard text={shuttleInAddress} onCopy={displayCopy}>
              <img alt="copy" className={shuttleInCx('copy')} src={copy}></img>
            </CopyToClipboard>
          ) : (
            <div className={shuttleInCx('copy')}>
              <Loading size="1rem" />
            </div>
          )}
        </div>
      </div>
      <div
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
          <img className={shuttleInCx('img')} alt="qr" src={qr}></img>
          <span>{t('qr')}</span>
        </span>
      </div>

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
      <Modal
        show={feePopup}
        title
        onClose={() => setFeePopup(false)}
        clickAway={() => setFeePopup(false)}
      >
        <div className={modalCx('content')}>
          <Trans
            values={{
              operation: t('shuttle-in'),
              ...tokenInfo,
              fee: tokenInfo['in_fee'],
              is_create:
                origin === chain ? t('wallet-create-fee', tokenInfo) : '',
            }}
            t={t}
            i18nKey="popup-fee"
          ></Trans>
        </div>
        <div className={modalCx('btn')} onClick={() => setFeePopup(false)}>
          {t('popup.ok')}
        </div>
      </Modal>
    </>
  )
}
