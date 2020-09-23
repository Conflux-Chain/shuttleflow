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
import styles from './Token.module.scss'
import MenuLink from "../component/MenuLink";
const cx = classNamesBind.bind(styles)



export default function Token({ match: { path, url }, history, location: { search } }) {
    const { t } = useTranslation()
    const captionUrl = `${url}/caption`
    return <div>
        <nav className={cx('nav-container')}>
            <div style={{ cursor: 'pointer', color: '#BBBBBB', flexGrow: 0 }} onClick={() => history.goBack()}>{'<'}</div>
            <div className={cx('nav-inner')}>
                <MenuLink to={url} exact render={({ active }) => {
                    return <div className={cx('item', { active })} >
                        <Link to={{
                            pathname: url,
                            search: search
                        }}>{t('sentence.choose-token')}</Link>
                    </div>
                }} />
                <MenuLink to={captionUrl} render={({ active }) => {
                    return <div className={cx('item', { active })} >
                        <Link to={{
                            pathname: captionUrl,
                            search: search
                        }}>{t('sentence.token-caption')}</Link>
                    </div>
                }} />


            </div>

        </nav>

        <Switch>
            <Route exact path={path} component={Choose} />
            <Route path={`${path}/caption`} component={Caption} />
        </Switch>


    </div>
}