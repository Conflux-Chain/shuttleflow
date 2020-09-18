import React from 'react'

import { Input, Spacer } from '@cfxjs/react-ui'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import styles from '../input.module.css'
import classNamesBind from 'classnames/bind'
const cx = classNamesBind.bind(styles)

export default function ShuttleIn({ location: { search }, match: { url } }) {
    const token = new URLSearchParams(search).get('token')
    const { t } = useTranslation()
    return <div>
        <div className={cx('input')}>
            <Input variant="solid" readOnly
                defaultValue={token || ''}
                width="100%"
                placeholder={t('placeholder.token-in')}
            />
            <Link to={{
                pathname: '/token',
                search: `?next=${url}`
            }} className={cx('arrow')}>{'>'} </Link>
        </div>
        <Spacer y={0.5} />
        <div className={cx('input')}>
            <Input variant="solid" readOnly
                width="100%"
                defaultValue={!token ? '' : 'c' + token}
                placeholder={t('placeholder.ctoken-in')}
            />
            <Link to={{
                pathname: '/token',
                search: `?next=${url}&cToken=1`
            }} className={cx('arrow')}>{'>'} </Link>
        </div>
        <Spacer y={0.5} />
        <div className={cx('input-label')}>
            <Input variant="solid" readOnly
                width="100%"
                placeholder={t('placeholder.shuttle-in-address')}
            >
                <div>{t('sentence.shuttle-in-address')}</div>
            </Input>
        </div>

    </div>
}

