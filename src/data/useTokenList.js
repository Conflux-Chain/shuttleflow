import { useEffect } from 'react'
import jsonrpc from './jsonrpc'
import useState1 from './useState1'

const REF_SYMBOL = { eth: 'ETH', btc: 'BTC' }
const REF_NAME = { eth: 'Ether', btc: 'Bitcoin' }

const supportedTokens = fetchTokenSponsor('getTokenList')
//prefetch the result even before the react started
//tell if the promise resolved
let supportedTokensResolved
supportedTokens.then((x) => {
  supportedTokensResolved = true
})

export default function useTokenList(search) {
  const [state, setState] = useState1({ tokens: [], isLoading: true })
  useEffect(() => {
    if (!supportedTokensResolved) {
      setState({ isLoading: true })
    }
    supportedTokens
      .then((tokens) => {
        tokens = tokens.map((t) => {
          t.reference_name = t.reference_name || REF_NAME[t.reference]
          t.reference_symbol = t.reference_symbol || REF_SYMBOL[t.reference]
          return t
        })

        supportedTokensResolved = true

        if (!search) return tokens

        search = search.toLowerCase()
        const found = tokens.filter(
          ({ ctoken, reference, reference_symbol, reference_name }) => {
            return (
              ctoken === search ||
              reference === search ||
              reference_symbol.toLowerCase().indexOf(search) > -1 ||
              reference_name.toLowerCase().indexOf(search) > -1
            )
          }
        )

        if (found.length > 0) {
          return found
        } else {
          if (isAddress(search)) {
            // requirement change: no backend search
            return []
            // return fetchTokenSponsor('searchToken', { params: [search] })
          } else {
            return []
          }
        }
      })
      .then((tokens) => {
        setState({ tokens, isLoading: false })
      })
  }, [search])
  return state
}

function isAddress(x) {
  return x.match(/^0x[0-9a-fA-F]{40}$/)
}

function fetchTokenSponsor(method = '', data = {}) {
  return jsonrpc(method, { url: 'sponsor', ...data }).then((result) => {
    console.log('fetchTokenSponsor', result)
    return (
      result
        //todo walk around bug
        .filter((x) => (method === 'getTokenList' ? x.ctoken : true))
        .map((d) => {
          // cToken的totalSupply和sponsor_value都是18位，除以1e18就行
          // 其他的都是decimal
          //todo symbol is undefined currently
          const {
            symbol,
            reference_symbol,
            reference_name,
            sponsor_value,
            total_supply,
            decimals,
            minimal_burn_value,
            minimal_mint_value,
            mint_fee,
            burn_fee,
            reference,
          } = d

          const refName = reference_name || REF_NAME[reference]
          const refSymbol = reference_symbol || REF_SYMBOL[reference]

          return {
            ...d,
            reference_name: refName,
            reference_symbol: refSymbol,
            symbol: symbol || 'c' + refSymbol,
            total_supply: format(total_supply, 18),
            sponsor_value: format(sponsor_value, 18),
            minimal_burn_value: format(minimal_burn_value, decimals),
            minimal_mint_value: format(minimal_mint_value, decimals),
            mint_fee: format(mint_fee, decimals),
            burn_fee: format(burn_fee, decimals),
          }
        })
    )
  })
}

function format(value, decimal) {
  return parseFloat((parseFloat(value) / Math.pow(10, decimal)).toFixed(6))
}
