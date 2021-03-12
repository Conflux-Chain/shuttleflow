import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useSWR from 'swr'
import { getTokenList } from './tokenList'
import useAddress from './useAddress'
import useTokenList from './useTokenList'

export default function useMyCaptain() {
  const address = useAddress()
  const { chain } = useParams()
  console.log('useMyCaptain', chain)
  // const [data, setData] = useState([])
  // useEffect(() => {
  //   getTokenList(chain)
  //     .then(({ tokenMap }) => {
  //       return ['0x08130635368aa28b217a4dfb68e1bf8dc525621c'].map(
  //         (address) => tokenMap[address]
  //       )
  //     })
  //     .then((data) => setData[data])
  // }, [chain])

  return useSWR(['useMyCaptain', chain], fetcher, {
    revalidateOnMount: true,
    initialData: [],
  })
}

function fetcher(key, chain) {
  return getTokenList(chain).then(({ tokenMap }) => {
    return ['0x08130635368aa28b217a4dfb68e1bf8dc525621c'].map(
      (address) => tokenMap[address]
    )
  })
  // .then((data) => setData[data])

  // Promise.resolve(['0x08130635368aa28b217a4dfb68e1bf8dc525621c'])
}
