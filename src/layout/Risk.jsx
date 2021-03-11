import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal, { modalStyles } from '../component/Modal'

import riskStyles from './risk.module.scss'
import useStyle from '../component/useStyle'
import { useRecoilState } from 'recoil'
import displyRiskAtom from '../state/displyRisk'
import Check from '../component/Check/Check'
import Button from '../component/Button/Button'
import { useParams } from 'react-router'

let onComfirm
export default function Risk() {
  const { chain } = useParams()
  const [riskCx, modalCx] = useStyle(riskStyles, modalStyles)
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
      <div className={modalCx('content')}>
        {t('risk.content', { chain: t(chain) })}
      </div>
      <div className={riskCx('check')}>
        <Check
          solid
          checked={checked}
          setChecked={setChecked}
          txt={t('risk.known')}
        />
      </div>

      <Button
        className={riskCx('btn')}
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
      </Button>
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
