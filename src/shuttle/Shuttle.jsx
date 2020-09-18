import React from 'react'
import { Spacer } from '@cfxjs/react-ui'
import {
    Switch,
    Route,
    Link, Redirect
} from "react-router-dom";

import ShuttleIn from './shuttle-in/ShuttleIn'
import ShuttleOut from './shuttle-out/ShuttleOut'

import { useTranslation } from "react-i18next";
import classNamesBind from "classnames/bind";
import styles from './Shuttle.module.css'
const cx = classNamesBind.bind(styles)
export default function Shuttle({ match: { path, url } }) {

    const { t } = useTranslation()
    return <div>
        <nav className={cx('nav')}>
            <Link to={`${url}/in`}>{t('word.shuttle-in')}</Link>
            <Spacer x={5} />
            <Link to={`${url}/out`}>{t('word.shuttle-out')}</Link>
        </nav>
        <Switch>
            <Redirect from={path} exact to={`${path}/in`} />
            <Route path={`${path}/in`} component={ShuttleIn} />
            <Route path={`${path}/out`} component={ShuttleOut} />
        </Switch>
    </div>
}