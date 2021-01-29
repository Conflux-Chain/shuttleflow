import { useState } from 'react'
import { useParams } from 'react-router'
import { ethTokenMap, btcTokenMap } from './tokenList'

export default function usePair(pairId) {
  const { chain } = useParams()
  const tokenMap = chain === 'btc' ? btcTokenMap : ethTokenMap
  const [pair, setPair] = useState(null)
  if (pairId) {
    tokenMap.then((x) => setPair(x[pairId]))
  }
  return pair
}
