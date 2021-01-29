import { useEffect } from 'react'
import useState1 from './useState1'

import {
  btcTokenList,
  ethTokenList,
  getBtcTokenList,
  getEthTokenList,
} from './tokenList'
import { useParams } from 'react-router'

let supportedTokensResolved

export default function useTokenList() {
  const [state, setState] = useState1({
    tokens: [],
    isLoading: supportedTokensResolved,
  })
  const { chain } = useParams()

  useEffect(() => {
    return (chain === 'btc'
      ? getBtcTokenList().btcTokenList
      : getBtcTokenList().ethTokenList
    ).then((tokens) => {
      setState({ tokens: tokens.filter((x) => x), isLoading: false })
    })
  }, [chain, setState])
  return state
}
