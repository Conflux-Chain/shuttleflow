import { useParams } from 'react-router'
import jsonrpc from './jsonrpc'
import useAddress from './useAddress'
import useSWRONCE from '../lib/useSWROnce'

export default function useShuttleInAddress() {
  const address = useAddress()
  const { chain } = useParams()
  return useSWRONCE(['shuttleInAddress', chain, address], fetcher).data
}

function fetcher(_key, chain, address) {
  // return jsonrpc(
  //   chain === 'btc' ? 'getUserReceiveWalletBtc' : 'getUserReceiveWalletEth',
  //   {
  //     url: 'node',
  //     params: [address, '0x0000000000000000000000000000000000000000'],
  //   }
  // )
  // console.log('fetch api')
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 3000)
  }).then(() => {
    return jsonrpc(
      chain === 'btc' ? 'getUserReceiveWalletBtc' : 'getUserReceiveWalletEth',
      {
        url: 'node',
        params: [address, '0x0000000000000000000000000000000000000000'],
      }
    )
  })
}
