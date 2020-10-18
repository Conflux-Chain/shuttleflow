import { useEffect } from 'react'
import useState1 from './useState1'

import tokenList from './tokenList'
import jsonrpc from './jsonrpc'

const REF_SYMBOL = { eth: 'ETH', btc: 'BTC' }
const REF_NAME = { eth: 'Ether', btc: 'Bitcoin' }

let supportedTokensResolved
tokenList.then((x) => {
  supportedTokensResolved = true
})

export default function useTokenList(search) {
  const [state, setState] = useState1({ tokens: [], isLoading: true })
  useEffect(() => {
    if (!supportedTokensResolved) {
      setState({ isLoading: true })
    }
    tokenList
      .then((tokens) => {
        tokens = tokens.map((t) => {
          t.reference_name = t.reference_name || REF_NAME[t.reference]
          t.reference_symbol = t.reference_symbol || REF_SYMBOL[t.reference]
          return t
        })

        supportedTokensResolved = true

        if (search) {
          const lowersearch = search.toLowerCase()
          const found = tokens.filter(
            //we can not ensure everything is defined from the backend
            ({ ctoken, reference, reference_symbol, reference_name }) => {
              return (
                ctoken === lowersearch ||
                reference === lowersearch ||
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
        }
      })
      .then((tokens) => {
        setState({ tokens, isLoading: false })
      })
  }, [search, setState])
  return state
}
