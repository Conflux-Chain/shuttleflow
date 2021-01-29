import { useEffect } from 'react'
import useState1 from './useState1'

import { getTokenList } from './tokenList'
import { isAddress } from '../util/address'
import jsonrpc from './jsonrpc'
import { useParams } from 'react-router'

let supportedTokensResolved

export default function useTokenList({ search, pair = '', cToken } = {}) {
  const [state, setState] = useState1({
    tokens: [],
    isLoading: supportedTokensResolved,
  })
  const { chain } = useParams()
  if (isAddress(search)) {
    if (!cToken) {
      pair = search
    }
  }

  // getTokenList(chain).then(({ tokenList }) => tokenList)
  // pair = pair.toLocaleLowerCase()
  useEffect(() => {
    return getTokenList(chain)
      .then(({ tokenList }) => tokenList)
      .then((tokens) => {
        if (tokens.length === 1) {
          return tokens
        }
        if (pair) {
          return Promise.resolve(tokens.filter(({ id }) => pair === id)).then(
            ([token]) => {
              if (!token) {
                return jsonrpc('searchToken', {
                  url: 'sponsor',
                  params: [pair || search],
                }).then((result) => {
                  if (result && result.is_valid_erc20) {
                    return [result]
                  } else {
                    return []
                  }
                })
              } else {
                return [token]
              }
            }
          )
        } else if (search) {
          const lowersearch = search.toLowerCase()
          if (isAddress(search)) {
            //MUST be ctoken search
            return tokens.filter(({ ctoken }) => lowersearch === ctoken)
          } else {
            return tokens
              .filter(
                ({ reference_symbol, reference_name, supported, symbol }) => {
                  return (
                    (reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
                      symbol.toLowerCase().indexOf(lowersearch) > -1 ||
                      reference_name.toLowerCase().indexOf(lowersearch) > -1) &&
                    (cToken ? supported === 1 : true)
                  )
                }
              )
              .slice()
              .sort(
                (
                  { supported: supported0, in_token_list: in_token_list0 },
                  { supported: supported1, in_token_list: in_token_list1 }
                ) => {
                  return (
                    supported1 - supported0 || in_token_list1 - in_token_list0
                  )
                }
              )
          }
        } else {
          return tokens.filter(
            ({ supported, in_token_list }) =>
              supported === 1 && in_token_list === 1
          )
        }
      })
      .then((tokens) => {
        console.log(tokens)
        setState({ tokens: tokens.filter((x) => x), isLoading: false })
      })
  }, [search, setState, pair, cToken, chain])
  return state
}
