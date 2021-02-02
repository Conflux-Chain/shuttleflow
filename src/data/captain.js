import { useEffect, useState } from 'react'
import jsonrpc from './jsonrpc'
import { getCustodianContract } from './contract'
import { ensureAddressForSdk } from '../util/address'

//txHash is used to flush data from server
export default function usePendingOperationInfo(reference, txHash) {
  const [info, setInfo] = useState({})
  useEffect(() => {
    if (reference) {
      let start = true
      Promise.all([
        jsonrpc('getPendingOperationInfo', { url: 'node', params: [reference] }),
        getCustodianContract()
          .token_cooldown(ensureAddressForSdk(reference))
          .call(),
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
  }, [reference, txHash])
  return info
}
