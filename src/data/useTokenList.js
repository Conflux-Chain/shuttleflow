import { useEffect } from 'react'
import useState1 from './useState1'

import tokenList from './tokenList'
import { isAddress } from './address'
import jsonrpc from './jsonrpc'

let supportedTokensResolved
// displayTokensList.then((x) => {
//   supportedTokensResolved = true
// })

export default function useTokenList({ search, erc20 = '', cToken } = {}) {
  const [state, setState] = useState1({
    tokens: [],
    isLoading: supportedTokensResolved,
  })
  if (isAddress(search)) {
    if (!cToken) {
      erc20 = search
    }
  }

  erc20 = erc20.toLocaleLowerCase()
  useEffect(() => {
    return tokenList
      .then((tokens) => {
        if (erc20) {
          return Promise.resolve(
            tokens.filter(({ reference }) => erc20 === reference)
          ).then(([token]) => {
            if (!token) {
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
            } else {
              return [token]
            }
          })
        } else if (search) {
          const lowersearch = search.toLowerCase()
          if (!erc20) {
            //must be ctoken search
            return tokens.filter(({ ctoken }) => lowersearch === ctoken)
          } else {
            return tokens.filter(
              ({ reference_symbol, reference_name, supported }) => {
                return (
                  (reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
                    reference_name.toLowerCase().indexOf(lowersearch) > -1) &&
                  (cToken ? supported === 1 : true)
                )
              }
            )
          }
        } else {
          return tokens.filter(
            ({ reference, supported, in_token_list }) =>
              ['btc', 'eth'].indexOf(reference) > -1 ||
              (supported === 1 && in_token_list === 1)
          )
        }
      })
      .then((tokens) => {
        setState({ tokens: tokens.filter((x) => x), isLoading: false })
      })
  }, [search, setState, erc20, cToken])
  return state
}
