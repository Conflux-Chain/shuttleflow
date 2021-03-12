import useSWR from 'swr'
import useAddress from './useAddress'

export default function useMyCaptain() {
  const address = useAddress()
//   const {chain}
  return useSWR(['useMyCaptain', address])
}

function fetcher(params) {
  return Promise.resolve(['0x08130635368aa28b217a4dfb68e1bf8dc525621c'])
}
