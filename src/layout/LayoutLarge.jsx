import React from 'react'
import { Select } from '@cfxjs/react-ui'

import {
    Link
} from "react-router-dom";

import Main from './Main'
import logo from './logo.svg'


import classNamesBind from "classnames/bind";
import styles from './Layout.module.scss'
const cx = classNamesBind.bind(styles)


export default function LayoutLarge() {
    return <div>
        <header className={cx('header-lg')}>
            <Link to='/'>
                <img src={logo}></img>
            </Link>
            <div className={cx('right')}>
                <span>Address</span>
                <Link to='/history'>History</Link>
                <Link to='/market'>Market</Link>
                <Link to='/caption'>Be caption</Link>
                <Select value='zh' className={cx('select')}>
                    <Select.Option value='en'>English</Select.Option>
                    <Select.Option value='zh'>中文</Select.Option>
                </Select>
            </div>
        </header>
        <div className={cx('container', 'large')}>
            <Main  />
        </div>
    </div>
}