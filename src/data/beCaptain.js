import { ensureAddressForSdk } from '../util/address'
import { getCustodianContract } from './contract'

export default function createBeCaptain(userAddress, erc20) {
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
          ensureAddressForSdk(erc20),
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
          ensureAddressForSdk(erc20),
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
