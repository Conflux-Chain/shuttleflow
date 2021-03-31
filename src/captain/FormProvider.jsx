import useAddress from '../data/useAddress'


import CaptainForm from './Form'

import useTokenList, { usePairInfo } from '../data/useTokenList'
import { giveTransactionResult } from '../globalPopup/TranscationResult'

export default function FormProvider({ pair }) {
  const address = useAddress()
  const { data: tokenInfo } = usePairInfo(pair)

  let {
    pendingCount,
    countdown,
    minimal_sponsor_amount,
    sponsor,

    sponsorValue,
    safe_sponsor_amount,
    out_fee,
    in_fee,
    wallet_fee,
    minimal_in_value,
    minimal_out_value,
    default_cooldown_minutes,
    mainPairSymbol,
    gasBalance,
    gasBalanceDisplay,
    beCaptain,
  } = tokenInfo

  const beCaptain1 = function ({
    amount,
    burnFee,
    mintFee,
    walletFee,
    minimalMintValue,
    minimalBurnValue,
    cb,
  }) {
    giveTransactionResult(
      beCaptain({
        amount,
        burnFee,
        mintFee,
        walletFee,
        minimalMintValue,
        minimalBurnValue,
      }),
      { done: cb }
    )
  }

  /**
   * the form default value can be read ONLY ONCE
   * make sure the default from data available when
   * the form compoment rendered the first time
   **/
  if (typeof pendingCount === 'number' && sponsorValue && gasBalance) {
    const data = {
      address,
      ...tokenInfo,
      pendingCount,
      countdown,
      currentMortgage: sponsorValue,
      currentMortgageBig: sponsorValue,
      sponsor,
      beCaptain: beCaptain1,
      minMortgageBig: minimal_sponsor_amount,
      cethBalanceBig: gasBalance,
      cethBalanceDisplay: gasBalanceDisplay,
      safeSponsorAmount: safe_sponsor_amount,
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
