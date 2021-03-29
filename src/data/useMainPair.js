import { getTokenList } from './tokenList'
import CHAIN_CONFIG from '../config/chainConfig'
import useSWR from 'swr'
import { useParams } from 'react-router'

export default function useMairPair() {
  const { chain } = useParams()
  return useSWR(['mainPair', chain], fetcher, {
    suspense: true,
  })
}

function fetcher(key, chain) {
  console.log('useMairPair fetcher')
  const { mainPair } = CHAIN_CONFIG[chain]
  return getTokenList(chain).then(({ tokenMap }) => {
    return tokenMap[mainPair]
  })
}
