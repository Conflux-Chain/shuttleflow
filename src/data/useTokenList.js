import { useParams } from 'react-router'
import CHAIN_CONFIG from '../config/chainConfig'

import { getTokenList } from './tokenList'
import useSWR from 'swr'
import { CHAIN_SINGLE_PAIR } from '../config/constant'
import { getIdFromToken, parseId } from '../util/id'
import jsonrpc from './jsonrpc'

import { updateTokenList } from './tokenList'

function fetcher(key, searchOrPair, chain, cToken) {
  let search, pair
  if (key === 'search') {
    search = searchOrPair
  } else if (key === 'pair') {
    pair = searchOrPair
  }
  const { singleToken, display, searchList } = CHAIN_CONFIG[chain]
  return getTokenList(chain).then(({ tokenList, tokenMap }) => {
    if (pair) {
      if (singleToken) {
        return { ...tokenList[0], singleton: true }
      } else {
        if (pair === CHAIN_SINGLE_PAIR) {
          return null
        } else {
          if (tokenMap[pair]) {
            return tokenMap[pair]
          } else {
            const { origin, originAddr } = parseId(pair)
            if (origin === chain) {
              return CHAIN_CONFIG[chain].searchTokenFromServer(originAddr)
            } else if (origin === 'cfx') {
              return searchCfxFromServer(originAddr, chain)
            }
          }
        }
      }
      // return singleToken
      //   ? { ...tokenList[0], singleton: true }
      //   : pair === CHAIN_SINGLE_PAIR
      //   ? null
      //   : tokenMap[pair] ||
      //     //pair is not present in tokenlist but searchable
      //     CHAIN_CONFIG[chain].searchList(tokenList, pair).then((x) => x[0])
    }
    if (!search) {
      return tokenList.filter(display)
    }

    return (cToken ? searchCfxList : searchList)(
      tokenList,
      search
    ).then((list) => sortSearchResult(list))
  })
}
export default function useTokenList({ pair, search, cToken } = {}) {
  const { chain } = useParams()
  return useSWR(
    pair ? ['pair', pair, chain] : ['search', search, chain, cToken],
    fetcher,
    { suspense: true, revalidateOnMount: true }
  ).data
}

function searchCfxList(list, search) {
  const lowerSearch = search.toLowerCase()
  return Promise.resolve(
    list.filter(
      ({ reference_name, reference_symbol, ctoken, symbol, supported }) => {
        return (
          //DO NOT present unsupported with ctoken
          supported &&
          (ctoken === search ||
            reference_symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
            symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
            reference_name.toLowerCase().indexOf(lowerSearch) > -1)
        )
      }
    )
  )
}

function sortSearchResult(list) {
  return list
    .slice()
    .sort(
      (
        { supported: supported0, in_token_list: in_token_list0 },
        { supported: supported1, in_token_list: in_token_list1 }
      ) => {
        return supported1 - supported0 || in_token_list1 - in_token_list0
      }
    )
}

function searchCfxFromServer(addr, chain) {
  return jsonrpc('searchToken', {
    url: 'sponsor',
    params: ['cfx', chain, addr],
  }).then((result) => {
    if (result && result.is_valid_erc20) {
      console.log(result)
      const token = { ...result, origin: 'cfx', to_chain: chain }

      const updatedList = updateTokenList('eth', token)
      return updatedList.then(({ tokenMap }) => {
        return tokenMap[getIdFromToken(token)]
      })
    }
  })
}
