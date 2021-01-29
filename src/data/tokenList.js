import jsonrpc from './jsonrpc'
import listItemMapper from './tokenListMapper'
//todo replace with real server api
const getListAPI = (chain) => {
  return jsonrpc('getTokenList', { url: 'sponsor' }).then((list) => {
    return list.filter((x) => {
      return chain === 'btc' ? x.reference === 'btc' : x.reference !== 'btc'
    })
  })
}

const chainDataStore = {}

//lazy initializtion with cache
export const getTokenList = (chain) => {
  if (!chainDataStore[chain]) {
    chainDataStore[chain] = getListAPI(chain)
      .then((list) => list.map(listItemMapper))
      .then((tokenList) => {
        const tokenMap = tokenList.reduce((pre, cur) => {
          pre[cur.id] = cur
          if (cur.reference) {
            pre[cur.reference] = cur //operation history data
          }
          return pre
        }, {})
        return { tokenList, tokenMap }
      })
  }
  return chainDataStore[chain]
}

// export default tokenList
