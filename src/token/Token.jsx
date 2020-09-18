import React from "react";
import {
    Switch,
    Route,
    Link
} from "react-router-dom";



import Choose from './choose/Choose'
import Caption from './caption/Caption';
import { useTranslation } from "react-i18next";


import classNamesBind from "classnames/bind";
import styles from './Token.module.css'
const cx = classNamesBind.bind(styles)


export default function Token({ match: { path, url }, history, location: { search } }) {
    const { t } = useTranslation()
    return <div>
        <nav className={cx('nav-container')}>
            <div style={{ cursor: 'pointer', color: '#BBBBBB', flexGrow: 0 }} onClick={() => history.goBack()}>{'<'}</div>
            <div className={cx('nav-inner')}>
                <Link to={{
                    pathname: url,
                    search: search
                }}>{t('sentence.choose-token')}</Link>
                <Link
                    to={{
                        pathname: `${url}/caption`,
                        //search param should never be lost
                        //even though in caption route
                        search: search
                    }}
                >{t('sentence.token-caption')}</Link>
            </div>

        </nav>

        <Switch>
            <Route exact path={path} component={Choose} />
            <Route path={`${path}/caption`} component={Caption} />
        </Switch>


    </div>
}