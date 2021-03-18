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
          reference,
          burnFee,
          mintFee,
          walletFee,
          minimalMintValue,
          minimalBurnValue
        )
        .sendTransaction({ from: userAddress })
    } else {
      console.log(
        reference,
        amount,
        burnFee,
        mintFee,
        walletFee,
        minimalMintValue,
        minimalBurnValue
      )
      return contract
        .sponsorToken(
          reference,
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
