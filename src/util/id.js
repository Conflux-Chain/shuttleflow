export function matchId(tokenInfo, id) {
  const { origin, to_chain, ctoken, reference } = tokenInfo
  // const otherChain = origin === 'cfx' ? to_chain : origin

  // const [_1, cfx, _2, other] = id.split('-')

  return [tokenInfo.ctoken, tokenInfo.reference].indexOf(id) > -1
}

export function getId(tokenInfo) {
  const { origin, to_chain, ctoken, reference } = tokenInfo
  const otherChain = origin === 'cfx' ? to_chain : origin
  return `${ctoken}-${otherChain}-${reference}`
  return tokenInfo.ctoken || tokenInfo.reference
}
