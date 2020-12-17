import { useEffect, useState } from 'react'
import jsonrpc from './jsonrpc'
import abi from './TokenSponsor.json'
import { SPONSOR_CONTRACT_ADDR } from '../config/config'
export default function usePendingOperationInfo(erc20, erc777) {
  const [info, setInfo] = useState({})
  useEffect(() => {
    if (erc20) {
      console.log(erc20, erc777)
      window.confluxJS
        .Contract({ abi })
        .sponsorValueOf(erc20)
        .call({ to: SPONSOR_CONTRACT_ADDR })
        .then((x) => {
          console.log(x && x.toString())
        })
      let start = true
      jsonrpc('getPendingOperationInfo', { url: 'node', params: [erc20] }).then(
        (v) => {
          if (v && start) {
            setInfo(v)
          }
        }
      )
      return () => {
        start = false
      }
    }
  }, [erc20])
  return info
}
