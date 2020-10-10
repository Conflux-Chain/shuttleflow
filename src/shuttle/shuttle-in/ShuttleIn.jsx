import React, { useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useSWR from 'swr'
import QRCode from 'qrcode.react'



import arrow from '../arrow.svg'
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
import swrSearchTokenFetcher from '../../data/mock/swrSearchTokenFetcher'



export default function ShuttleIn({ location: { search }, match: { url } }) {
  const [commonCx, shuttleCx, shuttleInCx, modalCx] = useStyle(
    commonInputStyles,
    shuttleStyle,
    shuttleInStyles,
    modalStyles
  )
  const token = new URLSearchParams(search).get('token')
  const { t } = useTranslation()
  const address = useShuttleInAddress(token, 'accountAddress')
  const { data: tokenInfo } = useSWR(token ? ['/address', token] : null, swrSearchTokenFetcher)

  const [addressPopup, setAddressPopup] = useState(false)
  const [cTokenPopup, setCTokenPopup] = useState(false)
  const [feePopup, setFeePopup] = useState(false)
  const [copyPopup, setCopyPopup] = useState(false)
  const [qrPopup, setQrPopup] = useState(false)


  const [fontWidth, setFontWidth] = useState('')
  //useful for copying 
  const copyInputRef = useRef(null)
  //useful for measure width for position the icon
  const cTokenInputRef = useRef(null)

  useEffect(() => {
    if (tokenInfo) {
      const input = getComputedStyle(cTokenInputRef.current)
      const font = input.getPropertyValue('font')
      const paddingLeft = input.getPropertyValue('padding-left')
      const width = get_tex_width(tokenInfo.cSymbol, font)
      setFontWidth(`calc(${width}px + ${paddingLeft} + 1rem)`)
    }
  }, [tokenInfo && tokenInfo.cSymbol])

  return (
    <div className={shuttleInCx('container')}>
      <div className={shuttleCx('input-arrow', { 'with-icon': !!tokenInfo })}>
        {tokenInfo && <img
          alt='icon'
          className={shuttleCx('icon')}
          src={tokenInfo.icon}
        ></img>}
        <input
          readOnly
          className={commonCx('input-common')}
          defaultValue={tokenInfo?.symbol}
          placeholder={t('placeholder.token-in')}
        />
        <Link
          to={{
            pathname: '/token',
            search: `?next=${url}`,
          }}
        >
          <img alt='arrow' className={shuttleCx('arrow')} src={arrow}></img>
        </Link>
      </div>
      <div className={shuttleCx('down')}>
        <img alt='down' src={down}></img>
      </div>
      <div className={shuttleCx('input-arrow', { 'with-icon': !!tokenInfo })}>
        {tokenInfo && <img
          alt='icon'
          className={shuttleCx('icon')}
          src={tokenInfo.icon}
        ></img>}
        <input
          ref={cTokenInputRef}
          readOnly
          className={commonCx('input-common')}
          defaultValue={tokenInfo?.cSymbol}
          placeholder={t('placeholder.ctoken-in')}
        />
        {fontWidth && <img onClick={() => setCTokenPopup(true)} alt='?' className={shuttleInCx('input-question')}
          style={{ left: fontWidth }}
          src={question}></img>}
        <Link
          to={{
            pathname: '/token',
            search: `?next=${url}&cToken=1`,
          }}
        >
          <img alt='arrow' className={shuttleCx('arrow')} src={arrow}></img>
        </Link>
      </div>

      {tokenInfo && <p
        className={shuttleCx('small-text')}>
        <span>{t('txt.shuttle-in-amount', { amount: tokenInfo.inMin, token: tokenInfo.symbol })}</span>
        <span style={{ display: 'flex' }}>
          <span>{t('txt.shuttle-in-fee', { amount: tokenInfo.inFee, ctoken: tokenInfo.cSymbol })}</span>
          <img alt='?' onClick={() => setFeePopup(true)} src={question}></img>
        </span>

      </p>}

      <label className={shuttleInCx('address')}>
        <div className={shuttleCx('title', 'with-question')}>
          <span>{t('txt.shuttle-in-address')}</span>
          <img alt='?' onClick={() => {
            console.log('setShuttleInPopup(true)')
            setAddressPopup(true)
          }} src={question}></img>
        </div>

        <div className={shuttleInCx('address-input')}>
          <input
            ref={copyInputRef}
            readOnly
            defaultValue={address}
            className={commonCx('input-common')}
            placeholder={t('placeholder.shuttle-in-address')}
          />
          {tokenInfo && <img alt='copy' className={shuttleInCx('copy')} src={copy}
            onClick={() => {
              copyInputRef.current.select()
              copyInputRef.current.setSelectionRange(0, 99999); /*For mobile devices*/
              document.execCommand("copy");
              setCopyPopup(true)
            }}
          ></img>}

        </div>
      </label>
      {tokenInfo && <p
        className={shuttleCx('small-text')}>
        <span>{t('txt.latest-address-please')}</span>
        <span onClick={() => setQrPopup(true)} style={{ display: 'flex', cursor: 'pointer' }}>
          <img style={{ marginRight: '1rem' }} alt='qr' src={qr}></img>
          <span>{t('txt.qrcode')}</span>
        </span>
      </p>}
      <ShuttleHistory />
      <Modal show={addressPopup} clickAway={() => setAddressPopup(false)}>
        <div className={modalCx('title')}>{t('popup.shuttle-in-title')}</div>
        <div className={modalCx('content')}>{t('popup.shuttle-in-address-content')}</div>
        <div className={modalCx('btn')} onClick={() => setAddressPopup(false)}>{t('popup.shuttle-in-btn')}</div>
      </Modal>
      <Modal show={cTokenPopup} clickAway={() => setCTokenPopup(false)}>
        <div className={modalCx('title')}>{t('popup.shuttle-in-title')}</div>
        <div className={modalCx('content')}>{t('popup.shuttle-in-cToken-content')}</div>
        <div className={modalCx('btn')} onClick={() => setCTokenPopup(false)}>{t('popup.shuttle-in-btn')}</div>
      </Modal>
      <Modal show={feePopup} clickAway={() => setFeePopup(false)}>
        <div className={modalCx('title')}>{t('popup.shuttle-in-title')}</div>
        <div className={modalCx('content')}>{t('popup.shuttle-in-fee-content', tokenInfo)}</div>
        <div className={modalCx('btn')} onClick={() => setFeePopup(false)}>{t('popup.shuttle-in-btn')}</div>
      </Modal>
      <Modal show={copyPopup} clickAway={() => setCopyPopup(false)}>
        <div className={shuttleInCx('copy-popup')}>
          <img alt='tick' src={tick}></img>
          <div>{t('popup.copy')}</div>
        </div>
      </Modal>

      <Modal show={qrPopup} clickAway={() => setQrPopup(false)}>
        <div >
          <div className={modalCx('title')}>{t('popup.in-address')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem' }}>
            <QRCode value={address} />
          </div>
        </div>
      </Modal>
    </div>
  )
}


function get_tex_width(txt, font) {
  const element = document.createElement('canvas');
  const context = element.getContext("2d");
  context.font = font;
  return context.measureText(txt).width;
}