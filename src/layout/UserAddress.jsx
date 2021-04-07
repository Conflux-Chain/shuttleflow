import React from 'react'
import { formatAddress } from '../util/address'
import styles from './UserAddress.module.scss'
import useStyle from '../component/useStyle'
import { useTranslation } from 'react-i18next'
import useAddress, { login } from '../data/useAddress'
import styled from 'styled-components'

export default function UserAddress() {
  const { t } = useTranslation(['nav'])
  const [cx] = useStyle(styles)
  const address = useAddress()
  return (
    <Container>
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
    </Container>
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

const Container = styled.div`
  padding: 8px 14px;
  font-size: 16px;
  border: 1px solid #44d7b6;
  border-radius: 18.5px;
  color: #44d7b6;
  font-size: 16px;
  white-space: nowrap;
`
