import jsonrpc from './jsonrpc'
import listItemMapper from './tokenListMapper'
//todo replace with real server api
const getListAPI = (chain) => {
  return jsonrpc('getTokenList', { url: 'sponsor', params: [chain] })
}

const chainDataStore = {}

//lazy initializtion with cache
export const getTokenList = (chain) => {
  if (!chainDataStore[chain]) {
    chainDataStore[chain] = getListAPI(chain)
      .then((list) => list.map(listItemMapper))
      .then((tokenList) => {
        const tokenMap = tokenList.reduce((pre, cur) => {
          pre[cur.id] = { ...cur, fromId: true }
          if (cur.reference) {
            pre[cur.reference] = { ...cur, fromRef: true } //operation history data
          }
          if (cur.ctoken) {
            pre[cur.ctoken] = { ...cur, fromCtoken: true } //operation history data
          }
          return pre
        }, {})
        return { tokenList, tokenMap }
      })
  }
  return chainDataStore[chain]
}
