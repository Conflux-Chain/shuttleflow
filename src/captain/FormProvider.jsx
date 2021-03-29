import { buildNum } from '../util/formatNum'
import useAddress from '../data/useAddress'

import useCaptain from '../data/useCaptainInfo'
import createBeCaptain from '../data/beCaptain'


import CaptainForm from './Form'

import useTokenList from '../data/useTokenList'
import { giveTransactionResult } from '../globalPopup/TranscationResult'

const MAX_DECIMAL_DISPLAY = 8

export default function FormProvider({ pair }) {
  const address = useAddress()
  const tokenInfo = useTokenList({ pair })

  const { decimals } = tokenInfo
  const {
    pendingCount,
    countdown,
    minimal_sponsor_amount,
    sponsor,
    cethBalance,
    currentMortgage,
    safeSponsorAmount,
    out_fee,
    in_fee,
    wallet_fee,
    minimal_in_value,
    minimal_out_value,
    default_cooldown_minutes,
    mainPairSymbol,
  } = useCaptain(tokenInfo)

  const beCaptain = function ({
    amount,
    burnFee,
    mintFee,
    walletFee,
    minimalMintValue,
    minimalBurnValue,
    cb,
  }) {
    giveTransactionResult(
      createBeCaptain(
        address,
        tokenInfo
      )({
        amount: amount && buildNum(amount, 18),
        burnFee: buildNum(burnFee, decimals),
        mintFee: buildNum(mintFee, decimals),
        walletFee: buildNum(walletFee, decimals),
        minimalMintValue: buildNum(minimalMintValue, decimals),
        minimalBurnValue: buildNum(minimalBurnValue, decimals),
      }),
      { done: cb }
    )
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
    const currentMortgageBig = currentMortgage
    const minMortgageBig = minimal_sponsor_amount
    const cethBalanceBig = cethBalance

    let cethBalanceDisplay = cethBalanceBig.round(MAX_DECIMAL_DISPLAY, 0)
    if (!cethBalanceDisplay.eq(cethBalanceBig)) {
      cethBalanceDisplay += '...'
    }

    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
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
      default_cooldown_minutes,
      mainPairSymbol,
    }
    return <CaptainForm {...data} />
  }
}
