import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import { buildNum } from '../util/formatNum'
import useAddress from '../data/useAddress'

import useCaptain from '../data/captain'

import formStyles from './Form.module.scss'
import modalStyles from '../component/modal.module.scss'
import { CONFLUXSCAN_TX } from '../config/config'
import createBeCaptain from '../data/beCaptain'
import Big from 'big.js'
import Modal from '../component/Modal'

import CaptainForm from './Form'

import success from './success.png'
import fail from './fail.png'
import useTokenList from '../data/useTokenList'

const MAX_DECIMAL_DISPLAY = 8

export default function FormProvider({ pair }) {
  const [popup, setPopup] = useState('')
  const { t } = useTranslation(['captain'])
  const [cx, modalCx] = useStyle(formStyles, modalStyles)
  const txHash = useRef('')
  const address = useAddress()
  const tokenInfo = useTokenList({ pair })
  const { decimals, reference } = tokenInfo
  const {
    pendingCount,
    countdown,
    minMortgage,
    cooldownMinutes,
    sponsor,
    cethBalance,
    currentMortgage,
    safeSponsorAmount,
    out_fee,
    in_fee,
    wallet_fee,
    minimal_in_value,
    minimal_out_value,
  } = useCaptain({ reference, decimals })

  const beCaptain = function ({
    amount,
    burnFee,
    mintFee,
    walletFee,
    minimalMintValue,
    minimalBurnValue,
  }) {
    createBeCaptain(
      address,
      tokenInfo.reference
    )({
      amount: amount && buildNum(amount, 18),
      burnFee: buildNum(burnFee, decimals),
      mintFee: buildNum(mintFee, decimals),
      walletFee: buildNum(walletFee, decimals),
      minimalMintValue: buildNum(minimalMintValue, decimals),
      minimalBurnValue: buildNum(minimalBurnValue, decimals),
    })
      .then((hash) => {
        txHash.current = hash
        setPopup('success')
      })
      .catch(() => {
        setPopup('fail')
      })
  }

  /**
   * the form default value can be read ONLY ONCE
   * make sure the default from data available when
   * the form compoment rendered the first time
   **/
  if (
    // false &&
    typeof pendingCount === 'number' &&
    currentMortgage &&
    cethBalance
  ) {
    const currentMortgageBig = new Big(currentMortgage).div('1e18')
    const minMortgageBig = new Big(minMortgage).div('1e18')

    const cethBalanceBig = new Big(cethBalance).div('1e18')

    let cethBalanceDisplay = cethBalanceBig.round(MAX_DECIMAL_DISPLAY, 0)
    if (!cethBalanceDisplay.eq(cethBalanceBig)) {
      cethBalanceDisplay += '...'
    }

    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
      cooldownMinutes,
      currentMortgage,
      sponsor,
      beCaptain,
      minMortgageBig,
      currentMortgageBig,
      cethBalanceBig,
      cethBalanceDisplay,
      safeSponsorAmount,
      out_fee,
      in_fee,
      wallet_fee,
      minimal_in_value,
      minimal_out_value,
    }
    return (
      <>
        <CaptainForm {...data} />
        <Modal show={popup} onClose={() => setPopup(false)} clickAway>
          <img
            className={cx('status-img')}
            src={popup === 'success' ? success : fail}
            alt="status"
          ></img>
          {popup === 'success' ? (
            <>
              <div className={modalCx('title')}>{t('success')}</div>
              <a
                rel="noreferrer"
                target="_blank"
                href={`${CONFLUXSCAN_TX}${txHash.current}`}
                className={modalCx('btn')}
              >
                {t('popup.details')}
              </a>
            </>
          ) : (
            <>
              <div className={modalCx('title')}>{t('fail')}</div>
              <div onClick={() => setPopup(false)} className={modalCx('btn')}>
                {t('popup.ok')}
              </div>
            </>
          )}
        </Modal>
      </>
    )
  }
}
