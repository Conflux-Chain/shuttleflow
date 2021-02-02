import { ensureAddressForSdk } from '../util/address'
import { getCustodianContract } from './contract'

export default function createBeCaptain(userAddress, reference) {
  return function beCaptain({
    amount,
    burnFee,
    mintFee,
    walletFee,
    minimalMintValue,
    minimalBurnValue,
  }) {
    const contract = getCustodianContract()
    if (!amount) {
      return contract
        .setTokenParams(
          ensureAddressForSdk(reference),
          burnFee,
          mintFee,
          walletFee,
          minimalMintValue,
          minimalBurnValue
        )
        .sendTransaction({ from: userAddress })
    } else {
      return contract
        .sponsorToken(
          ensureAddressForSdk(reference),
          amount,
          burnFee,
          mintFee,
          walletFee,
          minimalMintValue,
          minimalBurnValue
        )
        .sendTransaction({ from: userAddress })
    }
  }
}
