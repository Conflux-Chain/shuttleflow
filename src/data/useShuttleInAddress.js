import { useEffect, useState } from 'react'
import jsonrpc from './jsonrpc'
import useAddress from './useAddress'

export default function useShuttleInAddress(tokenInfo) {
  const address = useAddress()
  const { reference } = tokenInfo || {}
  const [result, setResult] = useState('')
  //the endpoint will be called over and over again
  //OK though
  useEffect(() => {
    let mount = true
    if (address && reference) {
      jsonrpc(
        reference === 'btc'
          ? 'getUserReceiveWalletBtc'
          : 'getUserReceiveWalletEth',
        {
          url: 'node',
          params: [address, '0x0000000000000000000000000000000000000000'],
        }
      ).then((e) => {
        if (mount) {
          setResult(e)
        }
      })
    }
    return () => {
      mount = false
    }
  }, [address, reference])

  return result
}
