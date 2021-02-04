import { ensureAddressForSdk } from '../util/address'
import { getBalanceContract } from './contract'
import useAddress from './useAddress'
import useSWR from 'swr'
import Big from 'big.js'

export function useBalance(tokenAddr, options = {}) {
  const address = useAddress()
  return useSWR(
    address && tokenAddr ? ['useBalance', address, tokenAddr] : null,
    fetcher,
    { revalidateOnMount: true, ...options }
  ).data
}

function fetcher(key, address, tokenAddr) {
  console.log('useBalance fetcher', address, tokenAddr)
  if (tokenAddr === 'cfx') {
    return window.confluxJS.getBalance(address).then((x) => {
      return x + ''
    })
  }
  return getBalanceContract()
    .tokenBalance(ensureAddressForSdk(address), ensureAddressForSdk(tokenAddr))
    .call()
    .then((x) => {
      return x + ''
    })
}
