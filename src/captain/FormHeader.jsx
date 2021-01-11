import Icon from '../component/Icon/Icon'
import profile from './profile.svg'
import formatAddress from '../component/formatAddress'
import { useEffect, useState } from 'react'
import WithQuestion from '../component/WithQuestion'

export default function Header({
  icon,
  formCx,
  t,
  reference_symbol,
  reference_name,
  supported,
  currentMortgageBig,
  sponsor,
  pendingCount,
  countdown,
}) {
  return (
    <>
      <div className={formCx('first-container')}>
        <div className={formCx('left')}>
          <Icon src={icon} style={{ marginRight: '1rem' }} />
          <div className={formCx('left-text')}>
            <div className={formCx('large-text')}>{reference_symbol}</div>
            <div className={formCx('small-text')}>{reference_name}</div>
          </div>
        </div>
        <div className={formCx('right')}>
          <div className={formCx('large-text')}>
            {(supported ? currentMortgageBig + '' : '--') + ' cETH'}
          </div>
          <div
            className={formCx('small-text')}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img
              alt="profile"
              className={formCx('profile')}
              src={profile}
            ></img>
            <span>{sponsor ? formatAddress(sponsor) : '--'}</span>
          </div>
        </div>
      </div>
      <div className={formCx('second-container')}>
        <div className={formCx('second-item')}>
          <div className={formCx('large-text')}>
            {supported ? pendingCount : '--'}
          </div>
          <div className={formCx('small-text', 'mTop')}>
            {t('pending-count')}
          </div>
        </div>
        <div className={formCx('second-item')}>
          <div className={formCx('large-text')}>
            {!supported ? (
              '--'
            ) : countdown && countdown !== 0 ? (
              <Countdown initValue={countdown} />
            ) : (
              formatSec(0)
            )}
          </div>
          <div className={formCx('small-text', 'mTop')}>
            <WithQuestion>{t('countdown')}</WithQuestion>
          </div>
        </div>
      </div>
    </>
  )
}

function formatSec(sec) {
  let hour = parseInt(sec / 3600)
  sec -= hour * 3600
  const minute = parseInt(sec / 60)
  sec -= minute * 60
  return [hour, minute, sec].map(padZero).join(':')
}

function padZero(value) {
  value += ''
  if (value.length === 1) {
    value = '0' + value
  }
  return value
}

function Countdown({ initValue }) {
  const [value, setValue] = useState(initValue)
  useEffect(() => {
    if (initValue > 0) {
      const timer = setInterval(() => {
        setValue((x) => Math.max(x - 1, 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [initValue])
  if (initValue > 0) {
    return formatSec(value)
  } else {
    return formatSec(0)
  }
}
