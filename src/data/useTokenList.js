import { useParams } from 'react-router'
import CHAIN_CONFIG from '../config/chainConfig'

import { getTokenList } from './tokenList'
import useSWR from 'swr'
import { CHAIN_SINGLE_PAIR } from '../config/constant'
import { getIdFromToken, parseId } from '../util/id'
import jsonrpc from './jsonrpc'

import { updateTokenList } from './tokenList'
import { isCfxAddress } from '../util/address'

function fetcher(key, searchOrPair, chain, cToken) {
  console.log(key, searchOrPair, chain, cToken)

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
    }
    if (!search) {
      return tokenList.filter(display)
    }

    return (cToken ? searchCfxList : searchList)(tokenList, search, chain).then(
      (e) => {
        console.log(e)
        return e
      }
    )
    // .then((list) => sortSearchResult(list))
  })
}

let counter = 0
export default function useTokenList({ pair, search, cToken } = {}) {
  const { chain } = useParams()

  console.log('useTokenList', pair, search, cToken)
  if (++counter > 100) {
    debugger
  }
  return useSWR(
    pair ? ['pair', pair, chain] : ['search', search, chain, cToken],
    fetcher,
    { suspense: true, revalidateOnMount: false }
  ).data
}

export function useTokenPair({ search, cToken } = {}) {
  const { chain } = useParams()

  console.log('useTokenPair', search, cToken)
  if (++counter > 100) {
    debugger
  }
  return useSWR(['search', search, chain, cToken], fetcher1, {
    suspense: true,
    // revalidateOnMount: false,
    initialData: [],
  }).data
}

function fetcher1(params) {
  return Promise.resolve([])
}

function searchCfxList(list, search, chain) {
  const lowerSearch = search.toLowerCase()
  const isAddressCfx = isCfxAddress(search)

  if (isAddressCfx) {
    return Promise.resolve(
      list.filter(({ ctoken }) => ctoken.toLowerCase() === lowerSearch)
    ).then((list) => {
      if (list.length === 1) {
        return list
      } else {
        return searchCfxFromServer(search, chain).then((result) => {
          return result ? [result] : []
        })
      }
    })
  } else {
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
  console.log('searchCfxFromServer', chain)
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
