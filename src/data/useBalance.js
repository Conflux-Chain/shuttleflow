import { getBalanceContract } from './contract'
import useAddress from './useAddress'
import useSWR from 'swr'
import Big from 'big.js'

export function useBalance(tokenInfo, options = {}) {
  const address = useAddress()
  const { ctoken, decimals, origin } = tokenInfo
  return useSWR(
    address && ctoken
      ? ['useBalance', address, ctoken, origin === 'cfx' ? decimals : 18]
      : null,
    fetcher,
    { revalidateOnMount: true, ...options }
  ).data
}

function fetcher(key, address, tokenAddr, decimals) {
  return (tokenAddr === 'cfx'
    ? window.confluxJS.getBalance(address)
    : getBalanceContract().tokenBalance(address, tokenAddr).call()
  ).then((x) => {
    return Big(x + '').div(`1e${decimals}`)
  })
}
