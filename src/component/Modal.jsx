import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './modal.module.scss'
import useStyle from './useStyle'

export default function Modal({ children, show, clickAway }) {

    return createPortal(
        show && <Inner clickAway={clickAway}>
            {children}
        </Inner>, document.getElementById('popup'))
}

function Inner({ children, clickAway }) {
    const ref = useRef(null)
    const [cx] = useStyle(styles)

    useEffect(() => {
        const listener = (e) => {
            if ((!ref.current.contains(e.target)) &&
                clickAway) {
                clickAway()
            }
        }
        window.addEventListener('mousedown', listener)
        return () => {
            window.removeEventListener('mousedown', listener)
        }
    }, [])
    return createPortal(
        <div ref={ref} className={cx('container')}>
            {children}
        </div>, document.getElementById('popup'))
}