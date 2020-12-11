import { useEffect } from 'react'
import useState1 from './useState1'

import tokenList from './tokenList'

let supportedTokensResolved
tokenList.then((x) => {
  supportedTokensResolved = true
})

export default function useTokenList(search, { isReference } = {}) {
  const [state, setState] = useState1({ tokens: [], isLoading: true })
  useEffect(() => {
    if (!supportedTokensResolved) {
      setState({ isLoading: true })
    }
    tokenList
      .then((tokens) => {
        supportedTokensResolved = true

        if (search) {
          const lowersearch = search.toLowerCase()
          const found = tokens.filter(
            //we can not ensure everything is defined from the backend
            ({ ctoken, reference, reference_symbol, reference_name }) => {
              return (
                ctoken === lowersearch ||
                reference === lowersearch ||
                (!isReference
                  ? (reference_symbol &&
                      reference_symbol.toLowerCase().indexOf(lowersearch) >
                        -1) ||
                    (reference_name &&
                      reference_name.toLowerCase().indexOf(lowersearch) > -1)
                  : false)
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
  }, [search, setState, isReference])
  return state
}
