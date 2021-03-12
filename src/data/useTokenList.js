import { useParams } from 'react-router'
import CHAIN_CONFIG from '../config/chainConfig'

import { getTokenList } from './tokenList'
import useSWR from 'swr'
import { CHAIN_SINGLE_PAIR } from '../config/constant'

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
      return singleToken
        ? { ...tokenList[0], singleton: true }
        : pair === CHAIN_SINGLE_PAIR
        ? null
        : tokenMap[pair] ||
          CHAIN_CONFIG[chain].searchList(tokenList, pair).then((x) => x[0])
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
    { suspense: true }
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
