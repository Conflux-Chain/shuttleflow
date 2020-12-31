import { useTranslation, Trans } from 'react-i18next'
import Modal, { modalStyles } from '../component/Modal'
import styles from './Spec.module.scss'
import useStyle from '../component/useStyle'
import { useState } from 'react'

export default function Spec() {
  const [displayPopup, setDisplayPopup] = useState(false)
  const { t } = useTranslation([])
  const [cx, modalCx] = useStyle(styles, modalStyles)
  return (
    <>
      <div onClick={() => setDisplayPopup(true)} className={cx('spec')}>
        {t('spec.btn')}
      </div>
      <Modal
        clickAway={() => setDisplayPopup(false)}
        onClose={() => setDisplayPopup(false)}
        show={displayPopup}
        title={t('spec.title')}
      >
        <div className={modalCx('content')}>
          <Trans i18nKey="spec.content" t={t}></Trans>
        </div>
        <div onClick={() => setDisplayPopup(false)} className={modalCx('btn')}>
          {t('popup.ok')}
        </div>
      </Modal>
    </>
  )
}
