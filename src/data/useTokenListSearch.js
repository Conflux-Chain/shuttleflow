import { useParams } from 'react-router'
import CHAIN_CONFIG from '../config/chainConfig'

import { getTokenList } from './tokenList'
import useSWR from 'swr'
import jsonrpc from './jsonrpc'

const displayFilters = {
  eth: ethDisplayFilter,
}
function fetcher(key, search, chain, cToken) {
  return getTokenList(chain).then(({ tokenList }) => {
    if (!search) {
      return tokenList.filter(displayFilters[chain])
    }
    return (cToken ? filterCfx : filterEth)(tokenList, search).then((list) =>
      sortSearchResult(list)
    )
  })
}
export default function useTokenListSearch(search, cToken, pair) {
  const { chain } = useParams()
  return useSWR(
    pair ? ['token', pair] : ['search', search, chain, cToken],
    fetcher
  ).data
}

function ethDisplayFilter({ supported, in_token_list }) {
  return supported === 1 && in_token_list === 1
}

function filterCfx(list, search) {
  const lowerSearch = search.toLowerCase()
  return Promise.resolve(
    list.filter(({ reference_name, reference_symbol, ctoken, supported }) => {
      return (
        //DO NOT present unsupported with ctoken
        supported &&
        (ctoken === search ||
          reference_symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
          reference_name.toLowerCase().indexOf(lowerSearch) > -1)
      )
    })
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
