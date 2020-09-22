import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import '../i18n/i18n'

import logo from './logo.svg'
import ham from './ham.svg'
import close from './close.svg'

import Main from './Main'


import classNamesBind from "classnames/bind";
import styles from './Layout.module.scss'
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
const cx = classNamesBind.bind(styles)




export default function LayoutSmall() {
    const [dropdown, setDropdown] = useState(false)
    const nodeRef = useRef(null)
    const { t } = useTranslation()
    return <div className={cx('container', 'small')}>
        <header className={cx('header-sm')}>
            <Link to='/'>
                <img src={logo}></img>
            </Link>
            <div className={cx('right')}>
                <span>Address</span>
                <img className={cx('ham')} src={dropdown ? close : ham} onClick={
                    () => {
                        setDropdown(x => !x)
                    }
                }></img>
            </div>
        </header>
        <CSSTransition nodeRef={nodeRef}
            classNames={{
                enter: cx('enter'),
                enterActive: cx('enterActive'),
                enterDone: cx('enterDone'),
                exitActive: cx('exitActive'),
            }}
            in={dropdown} mountOnEnter
            timeout={{ enter: 200, exit: 200 }} unmountOnExit>
            <div ref={nodeRef} className={cx('dropdown')}>
                <Link to='/history'>History</Link>
                <Link to='/market'>Market</Link>
                <Link to='/caption'>Be caption</Link>
                <div>{t('sentence.choose-lng')}</div>
            </div>
        </CSSTransition>

        <Main />
    </div>
}