import React from 'react'
import {
    Switch,
    Route,
    Link, Redirect,
    useRouteMatch
} from "react-router-dom";


import ShuttleIn from './shuttle-in/ShuttleIn'
import ShuttleOut from './shuttle-out/ShuttleOut'

import { useTranslation } from "react-i18next";
import classNamesBind from "classnames/bind";
import styles from './Shuttle.module.scss'
import { useMedia } from 'react-media';

import InLogo from './InLogo.jsx'

const cx = classNamesBind.bind(styles)
export default function Shuttle({ match: { path, url } }) {

    const { t } = useTranslation()
    const inUrl = `${url}/in`
    return <div>
        <nav className={cx('nav')}>
            <MenuLink to={inUrl} render={({ isSmall, active }) => {
                console.log('actibe', active)
                return <div className={cx('item', { active })} >
                    <InLogo active={active} />
                    <Link to={`${url}/in`}>{t('word.shuttle-in')}</Link>
                </div>
            }} />


            <div className={cx('item')}>
                <InLogo />
                <Link to={`${url}/out`}>{t('word.shuttle-out')}</Link>
            </div>

        </nav>
        <Switch>
            <Redirect from={path} exact to={`${path}/in`} />
            <Route path={`${path}/in`} component={ShuttleIn} />
            <Route path={`${path}/out`} component={ShuttleOut} />
        </Switch>
    </div>
}




function MenuLink({ render, to }) {
    const active = useRouteMatch({
        path: to,
        exact: false
    });
    const isSmall = useMedia({ query: "(max-width: 900px)" });
    return render({ active: !!active, isSmall })
}
