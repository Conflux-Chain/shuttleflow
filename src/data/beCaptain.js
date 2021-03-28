import { getContract } from './contract/contract'

export default function createBeCaptain(userAddress, tokenInfo) {
  const { reference, origin, ctoken, to_chain } = tokenInfo
  let toCfxOrFromCfx, referenceOrCtoken, notCfxChain

  if (origin === 'cfx') {
    toCfxOrFromCfx = 'fromCfx'
    referenceOrCtoken = ctoken
    notCfxChain = to_chain
  } else {
    toCfxOrFromCfx = 'toCfx'
    referenceOrCtoken = reference
    notCfxChain = origin
  }
  return function beCaptain({
    amount,
    burnFee,
    mintFee,
    walletFee,
    minimalMintValue,
    minimalBurnValue,
  }) {
    return getContract(`custodian.${toCfxOrFromCfx}.${notCfxChain}`).then(
      (c) => {
        const contract = c
        if (!amount) {
          return contract
            .setTokenParams(
              referenceOrCtoken,
              burnFee,
              mintFee,
              walletFee,
              minimalMintValue,
              minimalBurnValue
            )
            .sendTransaction({ from: userAddress })
        } else {
          console.log(
            referenceOrCtoken,
            amount,
            burnFee,
            mintFee,
            walletFee,
            minimalMintValue,
            minimalBurnValue
          )
          return contract
            .sponsorToken(
              referenceOrCtoken,
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
    )
  }
}
