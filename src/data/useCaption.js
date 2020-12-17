import { useEffect, useState } from 'react'
import jsonrpc from './jsonrpc'
import custodianAbi from './abi/CustodianImpl.json'
import { CUSTODIAN_CONTRACT_ADDR } from '../config/config'
export default function usePendingOperationInfo(erc20) {
  const [info, setInfo] = useState({})
  useEffect(() => {
    if (erc20) {
      let start = true
      Promise.all([
        jsonrpc('getPendingOperationInfo', { url: 'node', params: [erc20] }),
        window.confluxJS
          .Contract({ abi: custodianAbi })
          .token_cooldown(erc20)
          .call({ to: CUSTODIAN_CONTRACT_ADDR }),
      ]).then(([{ cnt }, cooldown]) => {
        if (start) {
          setInfo({
            pendingCount: cnt,
            formLast: parseInt(Date.now() / 1000 - parseInt(cooldown)),
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
