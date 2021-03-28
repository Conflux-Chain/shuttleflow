import { getContract } from './contract/contract'
import useAddress from './useAddress'
import useSWR from 'swr'
import Big from 'big.js'

export function useBalance(tokenInfo, options = {}) {
  const address = useAddress()
  return useSWR(
    tokenInfo
      ? [
          'useBalance',
          address,
          tokenInfo.ctoken,
          tokenInfo.origin === 'cfx' ? tokenInfo.decimals : 18,
        ]
      : null,
    fetcher,
    { revalidateOnMount: true, ...options }
  ).data
}

function fetcher(key, address, tokenAddr, decimals) {
  return (tokenAddr === 'cfx'
    ? window.confluxJS.getBalance(address)
    : getContract('balance').then((c) => {
        return c.tokenBalance(address, tokenAddr).call()
      })
  ).then((x) => {
    return Big(x + '').div(`1e${decimals}`)
  })
}
