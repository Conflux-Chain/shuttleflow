import { useEffect } from 'react'
import useState1 from './useState1'

import tokenList, { displayTokensList } from './tokenList'
import { isAddress } from './address'
import jsonrpc from './jsonrpc'

let supportedTokensResolved
displayTokensList.then((x) => {
  supportedTokensResolved = true
})

export default function useTokenList({ search, erc20 = '', cToken } = {}) {
  const [state, setState] = useState1({
    tokens: [],
    isLoading: supportedTokensResolved,
  })
  let erc777 = ''
  if (isAddress(search)) {
    if (cToken) {
      erc777 = search
    } else {
      erc20 = search
    }
  }

  erc20 = erc20.toLocaleLowerCase()
  erc777 = erc777.toLocaleLowerCase()
  useEffect(() => {
    ;(search || erc20 ? tokenList : displayTokensList)
      .then((tokens) => {
        if (erc20) {
          return Promise.resolve(
            tokens.filter(({ reference }) => {
              return erc20 === reference
            })
          ).then(([token]) => {
            if (!token) {
              return jsonrpc('searchToken', {
                url: 'sponsor',
                params: [search],
              }).then((result) => {
                if (result.is_valid_erc20) {
                  return [result]
                } else {
                  return []
                }
              })
            } else {
              return [token]
            }
          })
        } else if (erc777) {
          return tokens.filter(
            ({ ctoken: _ctoken, supported }) =>
              erc777 === _ctoken && supported === 1
          )
        } else if (search) {
          const lowersearch = search.toLowerCase()
          return tokens.filter(
            ({ reference_symbol, reference_name, supported }) => {
              return (
                (reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
                  reference_name.toLowerCase().indexOf(lowersearch) > -1) &&
                (cToken ? supported === 1 : true)
              )
            }
          )
        } else {
          return tokens
        }
      })
      .then((tokens) => {
        setState({ tokens: tokens.filter((x) => x), isLoading: false })
      })
  }, [search, setState, erc20, erc777, cToken])
  return state
}
