import React, { useState } from 'react'
import { Select } from '@cfxjs/react-ui'

import { useConfluxPortal } from '@cfxjs/react-hooks'

import Main from './Main'
import logo from './logo.svg'

import classNamesBind from 'classnames/bind'
import styles from './LayoutLarge.module.scss'
import MenuLink from '../component/MenuLink'
import { useTranslation } from 'react-i18next'
import formatAddress from '../component/formatAddress'
import Accordion from '../component/Accordion'
import useStyle from '../component/useStyle'




const cx = classNamesBind.bind(styles)



export default function LayoutLarge({ history }) {
  const {
    address,
  } = useConfluxPortal([
    '0x87010faf5964d67ed070bc4b8dcafa1e1adc0997', // fc contract address
    '0x85b1432b900ec2552a3f119d4e99f4b0f8078e29', // ceth contract address
  ])
  const [expandLng, setExpandLng] = useState(false)
  const { t } = useTranslation()



  return (
    <div className={cx('container')}>
      <header className={cx('header')}>
        <img alt="home" onClick={() => history.push('/')} src={logo}></img>

        <div className={cx('right')}>
          <span className={cx('address')}>{address ? formatAddress(address) : ''}</span>
          <MenuLink to='/history' render={({ active }) => {
            return <div
              onClick={() => history.push('/history')}
              className={cx('item', { active })}>{t('btn.history')}</div>
          }} />
          <MenuLink to='/market' render={({ active }) => {
            return <div
              onClick={() => history.push('/market')}
              className={cx('item', { active })}>{t('btn.markets')}</div>
          }} />
          <MenuLink to='/caption'
            render={({ active }) => {
              return <div
                onClick={() => history.push('/caption')}
                className={cx('item', { active })}>{t('btn.be-caption')}</div>
            }} />
          <Accordion
            contentStyle={{ position: 'absolute', right: '1rem', height: '5rem' }}
            expanded={expandLng}
            title={<div className={cx('lng')}
              onClick={() => setExpandLng(x => !x)} >Hello</div>}
            content={<div className={cx('dropdown-container')}>
              <div >English</div>
              <div>中文</div>
            </div>}
          ></Accordion>
        </div>
      </header>
      <div className={cx('main')}>
        <Main />
      </div>
    </div>
  )
}


