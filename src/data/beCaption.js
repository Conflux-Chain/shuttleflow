import { getCustodianContract } from './contract'

export default function createBeCaption(userAddress, erc20) {
  return function beCaption({
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

// // let

// window?.confluxJS?.Contract(params)
// export default function beCaption(){
//     ? c
//     ?.sponsorToken(
//       refAddr,
//       amount,
//       burnFee,
//       mintFee,
//       walletFee,
//       minimalMintValue,
//       minimalBurnValue
//     )
//     ?.sendTransaction({ from: userAddr, to: contractAddr })

//     ?.setTokenParams(
//         refAddr,
//         burnFee,
//         mintFee,
//         walletFee,
//         minimalMintValue,
//         minimalBurnValue
//       )
//       ?.sendTransaction({ from: userAddr, to: contractAddr })
// }
