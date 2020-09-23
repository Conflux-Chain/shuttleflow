import React from 'react'

import { Link } from 'react-router-dom'
import { Button, Input, Spacer } from '@cfxjs/react-ui'
import { useTranslation } from 'react-i18next'

import styles from '../input.module.scss'
import classNamesBind from 'classnames/bind'
const cx = classNamesBind.bind(styles)




export default function ShuttleOut({ location: { search }, match: { url } }) {
    const token = new URLSearchParams(search).get('token')
    const { t } = useTranslation()
    return <div>
        <div className={cx('input')}>
            <Input variant="solid" readOnly
                defaultValue={token || ''}
                width="100%"
            />
            <Link to={{
                pathname: '/token',
                search: `?next=${url}`
            }} className={cx('arrow')}>{'>'} </Link>
        </div>
        <Spacer y={1}></Spacer>
        <div className={cx('input')}>
            <Input variant="solid" readOnly
                defaultValue={token || ''}
                width="100%"
            />

            <Link to={{
                pathname: '/token',
                search: `?next=${url}`
            }} className={cx('arrow')}>{'>'} </Link>
        </div>
        <div className={cx('input-label')}>
            <Input variant="solid" width="100%">
                {t('sentence.out-amount')}
            </Input>
        </div>
        <div className={cx('input-label')}>
            <Input variant="solid" width="100%">
                {t('sentence.out-address')}
            </Input>
        </div>
        <div className={cx('button')}>
            <Button>
                {t('sentence.out-button')}
            </Button>
        </div>

    </div>
}