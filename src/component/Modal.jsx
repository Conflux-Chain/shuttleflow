import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import styles from './modal.module.scss'
import useStyle from './useStyle'
import close from './i-close-48.png'

import { Scrollbars } from 'react-custom-scrollbars-2'
import { renderThumbVerticalDark } from '../component/renderThumbVertical'

export const modalStyles = styles
export default function Modal({ children, show, ...props }) {
  return createPortal(
    show && <Inner {...props}>{children}</Inner>,
    document.getElementById('popup')
  )
}

function Inner({ children, clickAway, title, onClose, ok, content }) {
  const ref = useRef(null)
  const [cx] = useStyle(styles)
  const { t } = useTranslation()

  useEffect(() => {
    const listener = (e) => {
      if (!ref.current.contains(e.target) && clickAway) {
        typeof clickAway === 'function' ? clickAway() : onClose && onClose()
      }
    }
    window.addEventListener('mousedown', listener)
    return () => {
      window.removeEventListener('mousedown', listener)
    }
  }, [clickAway, onClose])
  return (
    <>
      <div className={cx('backdrop')}></div>
      <div ref={ref} className={cx('container')}>
        {onClose && (
          <img
            onClick={onClose}
            className={cx('close')}
            src={close}
            alt="close"
          ></img>
        )}

        <Scrollbars
          autoHeight
          autoHeightMax="80vh"
          renderThumbVertical={renderThumbVerticalDark}
        >
          <div className={cx('inner')}>
            {title && (
              <div className={cx('title')}>
                {typeof title === 'string' ? title : t('popup.title')}
              </div>
            )}
            {children}
            {content && <div className={cx('content')}>{content}</div>}
            {ok && (
              <div onClick={onClose} className={cx('btn')}>
                {t('popup.ok')}
              </div>
            )}
          </div>
        </Scrollbars>
      </div>
    </>
  )
}
