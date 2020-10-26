import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../component/Modal'
import modalStyles from '../component/modal.module.scss'
import buttonStyles from '../component/button.module.scss'
import riskStyles from './risk.module.scss'
import useStyle from '../component/useStyle'
import checkSrc from './i-check-64.png'
import checkedSrc from './i-checked-64.png'

export default function Risk() {
  const [riskCx, modalCx, buttonCx] = useStyle(
    riskStyles,
    modalStyles,
    buttonStyles
  )
  const [checked, setChecked] = useState(false)
  const [display, setDisplay] = useState(!localStorage.getItem('risk'))
  const { t } = useTranslation()
  return (
    <Modal show={display} title={t('risk.title')}>
      <div className={modalCx('content')}>{t('risk.content')}</div>
      <div className={riskCx('known')}>
        <img
          className={riskCx('img')}
          alt="check"
          onClick={() => setChecked((x) => !x)}
          src={!checked ? checkSrc : checkedSrc}
        ></img>
        <span>{t('risk.known')}</span>
      </div>

      <button
        className={buttonCx('btn') + ' ' + riskCx('btn')}
        disabled={!checked}
        onClick={() => {
          localStorage.setItem('risk', true)
          setDisplay(false)
        }}
      >
        {t('risk.continue')}
      </button>
    </Modal>
  )
}
