import { useEffect, useState } from 'react'
import jsonrpc from './jsonrpc'
import { getCustodianContract } from './contract'

export default function usePendingOperationInfo(erc20) {
  const [info, setInfo] = useState({})
  useEffect(() => {
    if (erc20) {
      let start = true
      Promise.all([
        jsonrpc('getPendingOperationInfo', { url: 'node', params: [erc20] }),
        getCustodianContract().token_cooldown(erc20).call(),
      ]).then(([{ cnt = 0 } = {}, cooldown]) => {
        if (start) {
          const diff = parseInt(Date.now() / 1000 - parseInt(cooldown))
          setInfo({
            pendingCount: cnt,
            countdown: Math.max(0, 3 * 60 * 60 - diff),
          })
        }
      })
      return () => {
        start = false
      }
    }
  }, [erc20])
  return info
}
