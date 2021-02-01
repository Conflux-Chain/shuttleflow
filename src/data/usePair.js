import { useParams } from 'react-router'
import { getTokenList } from './tokenList'
import wrapPromise from '../lib/wrapPromise'
import CHAIN_CONFIG from '../config/chainConfig'

const store = {}
export default function usePair(pair) {
  const { chain } = useParams()
  const pairOrChain = pair || chain
  if (!store[pairOrChain]) {
    store[pairOrChain] = wrapPromise(
      getTokenList(chain).then(({ tokenMap, tokenList }) => {
        //return the deault token if there is only one
        return CHAIN_CONFIG[chain].singleToken
          ? { ...tokenList[0], singleton: true }
          : tokenMap[pair].fromId
          ? tokenMap[pair]
          : undefined
      })
    )
  }

  return store[pairOrChain]()
}
