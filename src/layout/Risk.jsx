import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../component/Modal'
import modalStyles from '../component/modal.module.scss'
import buttonStyles from '../component/button.module.scss'
import riskStyles from './risk.module.scss'
import useStyle from '../component/useStyle'
import checkSrc from './i-check-64.png'
import checkedSrc from './i-checked-64.png'
import { useRecoilState } from 'recoil'
import displyRiskAtom from '../state/displyRisk'

let onComfirm
export default function Risk() {
  const [riskCx, modalCx, buttonCx] = useStyle(
    riskStyles,
    modalStyles,
    buttonStyles
  )
  const [checked, setChecked] = useState(false)
  const [displayFromLocalStorage, setLocalStorageDisplay] = useState(
    !localStorage.getItem('risk')
  )
  const [displayFromRecoil, setRecoilState] = useRecoilState(displyRiskAtom)
  const { t } = useTranslation()
  return (
    <Modal
      onClose={
        displayFromRecoil
          ? () => {
              setRecoilState(false)
            }
          : ''
      }
      show={displayFromLocalStorage || displayFromRecoil}
      title={t('risk.title')}
    >
      {displayFromRecoil && (
        <div className={modalCx('content')}>{t('risk.not-in-gecko')}</div>
      )}
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
          setChecked(false)
          setLocalStorageDisplay(false)
          setRecoilState(false)
          if (typeof onComfirm === 'function') {
            onComfirm()
            onComfirm = undefined
          }
        }}
      >
        {t('risk.continue')}
      </button>
    </Modal>
  )
}

export function useBlockWithRisk() {
  const [, setRecoilState] = useRecoilState(displyRiskAtom)
  return function (cb) {
    setRecoilState(true)
    onComfirm = cb
  }
}
