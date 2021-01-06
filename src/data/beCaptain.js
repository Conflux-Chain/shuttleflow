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
    if (amount === '0') {
      return contract
        .setTokenParams(
          erc20,
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
          erc20,
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
