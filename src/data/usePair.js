import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getTokenList } from './tokenList'

export default function usePair(pairId) {
  const { chain } = useParams()
  const [pair, setPair] = useState(null)
  useEffect(() => {
    getTokenList(chain).then(({ tokenMap }) => {
      setPair(tokenMap[pairId])
    })
  }, [chain, pairId])
  return pair
}
