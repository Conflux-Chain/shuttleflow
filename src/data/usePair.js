import { useParams } from 'react-router'
import { getTokenList } from './tokenList'
import CHAIN_CONFIG from '../config/chainConfig'
import useSWR from 'swr'

function fetcher(chain, pair) {
  return getTokenList(chain).then(({ tokenMap, tokenList }) => {
    console.log(chain, pair)
    //return the deault token if there is only one
    return CHAIN_CONFIG[chain].singleToken
      ? { ...tokenList[0], singleton: true }
      : pair
      ? tokenMap[pair]
      : null
  })
}
export default function usePair(pair) {
  const { chain } = useParams()
  return useSWR([chain, pair], fetcher).data
}
