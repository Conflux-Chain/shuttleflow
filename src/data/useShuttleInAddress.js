import { useParams } from 'react-router'
import jsonrpc from './jsonrpc'
import useAddress from './useAddress'
import useSWR from 'swr'

export default function useShuttleAddress({ type, origin }) {
  const address = useAddress()
  const { chain } = useParams()
  return useSWR(
    address ? ['shuttleInAddress', address, chain, origin, type] : null,
    fetcher,
    { revalidateOnMount: true }
  ).data
}

function fetcher(_key, address, chain, origin, type) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 0)
  }).then(() => {
    const isOriginCfx = origin === 'cfx'
    return jsonrpc('getUserWallet', {
      url: 'node',
      params: [
        address,
        '0x0000000000000000000000000000000000000000',
        origin,
        isOriginCfx ? chain : 'cfx',
        type,
      ],
    })
  })
}
