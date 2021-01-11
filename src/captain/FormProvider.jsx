import { useState, useMemo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import useStyle from '../component/useStyle'
import { buildNum, parseNum } from '../data/formatNum'
import useAddress from '../data/useAddress'
import { useBalance } from '../data/useBalance'

import useTokenList from '../data/useTokenList'
import useCaptain from '../data/captain'

import formStyles from './Form.module.scss'
import modalStyles from '../component/modal.module.scss'
import { CETH_ADDRESS } from '../config/config'
import createBeCaptain from '../data/beCaptain'
import getLatestMortgage from '../data/getLatestMortgage'
import Big from 'big.js'
import { Loading } from '@cfxjs/react-ui'
import Modal from '../component/Modal'

import CaptainForm from './Form'

import success from './success.png'
import fail from './fail.png'

//0xd50931bb32fca14acbc0cade5850ba597f3ee1a6
export default function FormProvider() {
  const { erc20 } = useParams()
  const [popup, setPopup] = useState('')
  const { t } = useTranslation(['captain'])
  const [cx, modalCx] = useStyle(formStyles, modalStyles)
  const address = useAddress()
  const cethBalance = useBalance(CETH_ADDRESS)

  /**
   * tokens will change on every render(no cache in useTokenList)
   * which will into invalid all the following identity check
   * no a big problem though
   */
  const { tokens } = useTokenList({ erc20 })
  const tokenInfo = useMemo(
    () => (tokens && tokens.length > 0 ? tokens[0] : {}),
    [tokens]
  )

  const { decimals } = tokenInfo
  const { pendingCount, countdown, minMortgage } = useCaptain(
    tokenInfo.reference
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
      erc20
    )({
      amount: amount && buildNum(amount, 18),
      burnFee: buildNum(burnFee, decimals),
      mintFee: buildNum(mintFee, decimals),
      walletFee: buildNum(walletFee, decimals),
      minimalMintValue: buildNum(minimalMintValue, decimals),
      minimalBurnValue: buildNum(minimalBurnValue, decimals),
    })
      .then((e) => {
        console.log(e)
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
    const currentMortgageBig = new Big(currentMortgage)
      .mul(Big('1.1'))
      .div('1e18')
    let minMortgageBig = new Big(minMortgage).div('1e18')

    if (currentMortgageBig.gt(minMortgageBig)) {
      minMortgageBig = currentMortgageBig
    }
    const defaultMortgageBig = minMortgageBig.plus('1e-8')
    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
      currentMortgage,
      beCaptain,
      minMortgage,
      minMortgageBig,
      currentMortgageBig,
      defaultMortgageBig,
      cethBalance: parseNum(cethBalance, 18),
    }
    return (
      <>
        <CaptainForm {...data} />
        <Modal show={popup} clickAway={() => setPopup(false)}>
          <img
            className={cx('status-img')}
            src={popup === 'success' ? success : fail}
            alt="status"
          ></img>
          <div className={modalCx('title')}>
            {t(popup === 'success' ? 'success' : 'fail')}
          </div>
          <div onClick={() => setPopup('')} className={modalCx('btn')}>
            {t('popup.ok')}
          </div>
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
