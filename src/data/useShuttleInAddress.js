import { useEffect, useState } from 'react'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import jsonrpc from './jsonrpc'

export default function useShuttleInAddress(tokenInfo) {
  const { address } = useConfluxPortal()
  const { reference } = tokenInfo || {}
  const [result, setResult] = useState('')
  //the endpoint will be called over and over again
  //OK though
  useEffect(() => {
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
        setResult(e)
      })
    }
  }, [address, reference])

  return result
}
