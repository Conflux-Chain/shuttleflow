import React from 'react'
import { formatAddress } from '../util/address'
import styles from './UserAddress.module.scss'
import useStyle from '../component/useStyle'
import { useTranslation } from 'react-i18next'
import useAddress, { login } from '../data/useAddress'

export default function UserAddress() {
  const { t } = useTranslation(['nav'])
  const [cx] = useStyle(styles)
  const address = useAddress()
  return (
    <div style={{ whiteSpace: 'nowrap' }}>
      <Circle active={!!address} />
      <span className={cx('address', { active: address })}>
        {address ? (
          formatAddress(address, { chain: 'cfx' })
        ) : (
          <span onClick={login} style={{ cursor: 'pointer' }}>
            {t('connect')}
          </span>
        )}
      </span>
    </div>
  )
}

function Circle({ active }) {
  return (
    <svg width="12px" height="12px" viewBox="0 0 12 12">
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <circle
          stroke={'#FFFFFF'}
          strokeWidth={0.8}
          fill={active ? '#44D7B6' : '#777777'}
          cx={6}
          cy={6}
          r={3.6}
        />
        <circle stroke={active ? '#44D7B6' : '#FFFFFF'} cx={6} cy={6} r={5.6} />
      </g>
    </svg>
  )
}
