import React from 'react'
import {
    Switch,
    Route,
    Link, Redirect,
} from "react-router-dom";


import ShuttleIn from './shuttle-in/ShuttleIn'
import ShuttleOut from './shuttle-out/ShuttleOut'

import { useTranslation } from "react-i18next";
import styles from './Shuttle.module.scss'

import inActiveSvg from './in-active.svg'
import inSvg from './in.svg'
import outActiveSvg from './out-active.svg'
import outSvg from './out.svg'

import MenuLink from '../component/MenuLink'
import useIsSamll from '../component/useSmallScreen';
import useStyle from '../component/useStyle';



export default function Shuttle({ match: { path, url } }) {
    const [cx]=useStyle(styles)
    const { t } = useTranslation()
    const inUrl = `${url}/in`
    const outUrl = `${url}/out`
    const isSmall = useIsSamll()
    return <div>
        <nav className={cx(isSmall ? 'nav' : 'nav')}>
            <MenuLink to={inUrl} render={({ active }) => {
                return <div className={cx('item', { active })} >
                    <Link to={inUrl}>
                        <img src={active ? inActiveSvg : inSvg}></img>
                        <span>{t('word.shuttle-in')}</span>
                    </Link>
                </div>
            }} />

            <MenuLink to={outUrl} render={({ active }) => {
                return <div className={cx('item', { active })} >
                    <Link to={outUrl}>
                        <img src={active ? outActiveSvg : outSvg}></img>
                        <span>{t('word.shuttle-out')}</span>
                    </Link>
                </div>
            }} />



        </nav>
        <Switch>
            <Redirect from={path} exact to={`${path}/in`} />
            <Route path={`${path}/in`} component={ShuttleIn} />
            <Route path={`${path}/out`} component={ShuttleOut} />
        </Switch>
    </div>
}




