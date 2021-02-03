import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'
import { buildNum } from '../util/formatNum'
import useAddress from '../data/useAddress'
import { useBalance } from '../data/useBalance'

import useCaptain from '../data/captain'

import formStyles from './Form.module.scss'
import modalStyles from '../component/modal.module.scss'
import { CETH_ADDRESS, CONFLUXSCAN_TX } from '../config/config'
import createBeCaptain from '../data/beCaptain'
import getLatestMortgage from '../data/getLatestMortgage'
import Big from 'big.js'
import { Loading } from '@cfxjs/react-ui'
import Modal from '../component/Modal'

import CaptainForm from './Form'

import success from './success.png'
import fail from './fail.png'
import useTokenList from '../data/useTokenList'

const MAX_DECIMAL_DISPLAY = 8

//0xd50931bb32fca14acbc0cade5850ba597f3ee1a6
export default function FormProvider({ pair }) {
  const [popup, setPopup] = useState('')
  const { t } = useTranslation(['captain'])
  const [cx, modalCx] = useStyle(formStyles, modalStyles)
  const address = useAddress()
  const cethBalance = useBalance(CETH_ADDRESS)
  const txHash = useRef()

  const tokenInfo = useTokenList({ pair }) || {}

  const { decimals, sponsor } = tokenInfo
  const { pendingCount, countdown, minMortgage, cooldownMinutes } = useCaptain(
    tokenInfo.reference,
    txHash
  )

  const [currentMortgage, setCurrentMortgage] = useState()

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
      pair
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

  const updateMinMortgage = useCallback((reference) => {
    getLatestMortgage(reference).then((x) => {
      setCurrentMortgage(x && x.toString())
    })
  }, [])

  useEffect(() => {
    if (tokenInfo.reference) {
      updateMinMortgage(tokenInfo.reference)
    }
  }, [updateMinMortgage, tokenInfo.reference])

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

    //todo 1.1 should come from contract sponsor replace ratio
    const currentMortgagereplaceBig = currentMortgageBig.mul(Big('1.1'))

    let minMortgageBigToDisplay = currentMortgagereplaceBig.gt(minMortgageBig)
      ? currentMortgagereplaceBig
      : minMortgageBig

    const cethBalanceBig = new Big(cethBalance).div('1e18')

    let cethBalanceDisplay = cethBalanceBig.round(MAX_DECIMAL_DISPLAY, 0)
    if (!cethBalanceDisplay.eq(cethBalanceBig)) {
      cethBalanceDisplay += '...'
    }

    minMortgageBigToDisplay = minMortgageBigToDisplay.round(
      MAX_DECIMAL_DISPLAY,
      3
    )
    const defaultMortgageBig =
      !sponsor || minMortgageBig.gt(minMortgageBigToDisplay)
        ? minMortgageBig
        : minMortgageBigToDisplay.plus(`1e-${MAX_DECIMAL_DISPLAY}`)

    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
      cooldownMinutes,
      currentMortgage,

      beCaptain,
      minMortgage,
      minMortgageBig: minMortgageBigToDisplay,
      currentMortgageBig,
      defaultMortgageBig,
      cethBalanceBig,
      cethBalanceDisplay,
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
  } else {
    return (
      <div className={cx('loading-container')}>
        <Loading size="large" />
      </div>
    )
  }
}
