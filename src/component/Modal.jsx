import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import styles from './modal.module.scss'
import useStyle from './useStyle'

export default function Modal({ children, show, ...props }) {
  return createPortal(
    show && <Inner {...props}>{children}</Inner>,
    document.getElementById('popup')
  )
}

function Inner({ children, clickAway, title }) {
  const ref = useRef(null)
  const [cx] = useStyle(styles)
  const { t } = useTranslation()

  useEffect(() => {
    const listener = (e) => {
      if (!ref.current.contains(e.target) && clickAway) {
        clickAway()
      }
    }
    window.addEventListener('mousedown', listener)
    return () => {
      window.removeEventListener('mousedown', listener)
    }
  }, [clickAway])
  return createPortal(
    <div ref={ref} className={cx('container')}>
      {title && (
        <div className={cx('title')}>
          {typeof title === 'string' ? title : t('popup.title')}
        </div>
      )}
      {children}
    </div>,
    document.getElementById('popup')
  )
}
