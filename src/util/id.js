export function getIdFromToken(tokenInfo) {
  const { origin, to_chain, ctoken, reference } = tokenInfo
  const notCfxChain = origin === 'cfx' ? to_chain : origin
  const originAddr = origin === 'cfx' ? ctoken : reference
  return `${notCfxChain}-${originAddr}`
}

export function getIdfromOperationHistory(token, chain) {
  return `${chain}-${token}`
}

//Data format is compatible, Just in case change in future
export const getIdFromSponsorInfo = getIdFromToken
