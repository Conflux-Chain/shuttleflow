import { useParams } from 'react-router'
import CHAIN_CONFIG from '../config/chainConfig'

import { getTokenList } from './tokenList'
import useSWR from 'swr'
import jsonrpc from './jsonrpc'
import { CHAIN_SINGLE_PAIR } from '../config/constant'

const displayFilters = {
  eth: ethDisplayFilter,
}
function fetcher(key, searchOrPair, chain, cToken) {
  let search, pair
  if (key === 'search') {
    search = searchOrPair
  } else if (key === 'pair') {
    pair = searchOrPair
  }
  return getTokenList(chain).then(({ tokenList, tokenMap }) => {
    if (pair) {
      return CHAIN_CONFIG[chain].singleToken
        ? { ...tokenList[0], singleton: true }
        : pair === CHAIN_SINGLE_PAIR
        ? null
        : tokenMap[pair]
    }
    if (!search) {
      return tokenList.filter(displayFilters[chain])
    }
    return (cToken ? filterCfx : filterEth)(tokenList, search).then((list) =>
      sortSearchResult(list)
    )
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

function ethDisplayFilter({ supported, in_token_list, origin }) {
  return origin === 'cfx' || (supported === 1 && in_token_list === 1)
}

function filterCfx(list, search) {
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

function filterEth(list, search) {
  const isEthAddress = CHAIN_CONFIG['eth'].outFormatCheck(search)
  const lowersearch = search.toLowerCase()
  if (isEthAddress) {
    return Promise.resolve(
      list.filter(({ reference }) => reference.toLowerCase() === lowersearch)
    ).then((list) => {
      if (list.length === 1) {
        return list
      } else {
        return jsonrpc('searchToken', {
          url: 'sponsor',
          params: [search],
        }).then((result) => {
          if (result && result.is_valid_erc20) {
            return [result]
          } else {
            return []
          }
        })
      }
    })
  }

  return Promise.resolve(
    list.filter(
      ({ reference_symbol, reference_name }) =>
        reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
        reference_name.toLowerCase().indexOf(lowersearch) > -1
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
