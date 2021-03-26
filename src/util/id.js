export function getId(tokenInfo) {
  const { origin, to_chain, ctoken, reference } = tokenInfo
  const notCfxChain = origin === 'cfx' ? to_chain : origin
  const originAddr = origin === 'cfx' ? ctoken : reference
  return `${notCfxChain}-${originAddr}`
}
