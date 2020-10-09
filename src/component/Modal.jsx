import React from 'react'
import { createPortal } from 'react-dom'
import styles from './modal.module.scss'
import useStyle from './useStyle'

export default function Modal({ children, show }) {
    const [cx] = useStyle(styles)
    return createPortal(
        show && <div className={cx('container')}>
            {children}
        </div>, document.getElementById('popup'))
}