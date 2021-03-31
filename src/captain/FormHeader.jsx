import Icon from '../component/Icon/Icon'
import profile from './profile.svg'
import { formatAddress } from '../util/address'
import { useEffect, useState } from 'react'
import WithQuestion from '../component/WithQuestion'
import Modal from '../component/Modal'
import { CONFLUXSCAN_ADDR } from '../config/config'

export default function Header({
  icon,
  formCx,
  isMe,
  t,
  reference_symbol,
  reference_name,
  supported,
  sponsorValue,
  sponsor,
  pendingCount,
  countdown,
  in_token_list,
  default_cooldown_minutes,
  mainPairSymbol,
}) {
  const [cooldownPopup, setCooldownPopup] = useState(false)

  return (
    <>
      <div className={formCx('first-container')}>
        <div className={formCx('left')}>
          <Icon
            icon={icon}
            in_token_list={in_token_list}
            style={{ marginRight: '1rem' }}
          />
          <div className={formCx('left-text')}>
            <div className={formCx('large-text')}>{reference_symbol}</div>
            <div className={formCx('small-text')}>{reference_name}</div>
          </div>
        </div>
        <div className={formCx('right')}>
          <div className={formCx('large-text')}>
            {(supported ? sponsorValue + '' : '--') + ' ' + mainPairSymbol}
          </div>
          <div
            className={formCx('small-text')}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {isMe ? (
              <span style={{ color: '#44d7b6' }}>{t('me')}</span>
            ) : (
              <>
                <img
                  alt="profile"
                  className={formCx('profile')}
                  src={profile}
                ></img>
                <span>
                  {sponsor ? (
                    <a
                      className={formCx('address')}
                      href={`${CONFLUXSCAN_ADDR}/${sponsor}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatAddress(sponsor, { chain: 'cfx' })}
                    </a>
                  ) : (
                    '--'
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={formCx('second-container')}>
        <div className={formCx('second-item')}>
          <span className={formCx('small-text')}>{t('pending-count')}</span>
          <span className={formCx('large-text')} style={{ marginLeft: '1rem' }}>
            {supported ? pendingCount : '--'}
          </span>
        </div>
        {isMe && (
          <div className={formCx('second-item')}>
            <div className={formCx('small-text')}>
              <WithQuestion onClick={() => setCooldownPopup(true)}>
                {t('countdown')}
              </WithQuestion>
            </div>
            <div
              className={formCx('large-text')}
              style={{ marginLeft: '1rem' }}
            >
              {!supported ? (
                '--'
              ) : countdown && countdown !== 0 ? (
                <Countdown initValue={countdown} />
              ) : (
                formatSec(0)
              )}
            </div>
          </div>
        )}
      </div>
      <Modal
        show={cooldownPopup}
        clickAway
        onClose={() => setCooldownPopup(false)}
        title
        ok
        content={t('popup-cool', { cooldownMinutes: default_cooldown_minutes })}
      ></Modal>
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
