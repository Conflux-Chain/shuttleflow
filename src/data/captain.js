import { useEffect, useState } from 'react'
import jsonrpc from './jsonrpc'
import { getCustodianContract } from './contract'

//txHash is used to flush data from server
export default function usePendingOperationInfo(erc20, txHash) {
  const [info, setInfo] = useState({})
  useEffect(() => {
    if (erc20) {
      let start = true
      Promise.all([
        jsonrpc('getPendingOperationInfo', { url: 'node', params: [erc20] }),
        getCustodianContract().token_cooldown(erc20).call(),
        getCustodianContract().minimal_sponsor_amount().call(),
        getCustodianContract().default_cooldown().call(),
      ]).then(([{ cnt = 0 } = {}, cooldown, minMortgage, defaultCooldown]) => {
        if (start) {
          const cooldownMinutes = parseInt(defaultCooldown) / 60
          const diff = parseInt(Date.now() / 1000 - parseInt(cooldown))
          setInfo({
            cooldownMinutes,
            pendingCount: cnt,
            minMortgage: minMortgage.toString(),
            countdown: Math.max(0, parseInt(defaultCooldown + '') - diff),
          })
        }
      })
      return () => {
        start = false
      }
    }
  }, [erc20, txHash])
  return info
}
