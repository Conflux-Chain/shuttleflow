export function matchId(tokenInfo, id) {
  return [tokenInfo.ctoken, tokenInfo.reference].indexOf(id) > -1
}

export function getId(tokenInfo) {
  return tokenInfo.ctoken, tokenInfo.reference
}
