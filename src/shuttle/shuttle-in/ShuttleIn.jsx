import React from 'react'

import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

import arrow from '../arrow.svg'
import down from '../down.svg'

import useStyle from '../../component/useStyle'
import commonInputStyles from '../../component/input.module.scss'
import arrowInputStyles from '../input.module.scss'
import shuttleInStyles from './ShuttleIn.module.scss'


export default function ShuttleIn({ location: { search }, match: { url } }) {
    const [commonCx, arrowCx, shuttleInCx] = useStyle(commonInputStyles, arrowInputStyles, shuttleInStyles)
    const token = new URLSearchParams(search).get('token')
    const { t } = useTranslation()
    return <div className={shuttleInCx('container')}>
        <div className={arrowCx('input-arrow')}>
            <input readOnly
                className={commonCx('input-common')}
                defaultValue={token || ''}
                placeholder={t('placeholder.token-in')}
            />
            <Link to={{
                pathname: '/token',
                search: `?next=${url}`
            }} ><img className={arrowCx('arrow')} src={arrow}></img></Link>
        </div>
        <div className={shuttleInCx('down')}>
            <img src={down}></img>
        </div>
        <div className={arrowCx('input-arrow')}>
            <input readOnly
                className={commonCx('input-common')}
                defaultValue={token || ''}
                defaultValue={!token ? '' : 'c' + token}
                placeholder={t('placeholder.ctoken-in')}
            />
            <Link to={{
                pathname: '/token',
                search: `?next=${url}`
            }} ><img className={arrowCx('arrow')} src={arrow}></img></Link>
        </div>
        <div className={shuttleInCx('title')}>
            {t('sentence.shuttle-in-address')}
        </div>

        <div className={arrowCx('input-arrow')}>
            <input readOnly
                className={commonCx('input-common')}
                placeholder={t('placeholder.shuttle-in-address')}
            />
        </div>

    </div>
}

