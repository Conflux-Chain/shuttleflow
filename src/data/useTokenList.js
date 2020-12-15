import { useEffect } from 'react'
import useState1 from './useState1'

import tokenList, { displayTokensList } from './tokenList'
import { isAddress } from './address'

let supportedTokensResolved
displayTokensList.then((x) => {
  supportedTokensResolved = true
})

export default function useTokenList({ search, erc20 = '', cToken } = {}) {
  const [state, setState] = useState1({
    tokens: [],
    isLoading: supportedTokensResolved,
  })
  if (isAddress(search)) {
    erc20 = search
  }

  erc20 = erc20.toLocaleLowerCase()
  useEffect(() => {
    ;(search ? tokenList : displayTokensList)
      .then((tokens) => {
        if (erc20) {
          return tokens.filter(
            ({ reference: _reference }) => erc20 === _reference
          )
        } else if (search) {
          const lowersearch = search.toLowerCase()
          const found = tokens.filter(
            //we can not ensure everything is defined from the backend
            ({ reference_symbol, reference_name }) => {
              return (
                (reference_symbol &&
                  reference_symbol.toLowerCase().indexOf(lowersearch) > -1) ||
                (reference_name &&
                  reference_name.toLowerCase().indexOf(lowersearch) > -1)
              )
            }
          )

          if (found.length > 0) {
            return found
          } else {
            return []
          }
        } else {
          return tokens
        }
      })
      .then((tokens) => {
        setState({ tokens, isLoading: false })
      })
  }, [search, setState, erc20])
  return state
}
