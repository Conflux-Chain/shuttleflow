import { ensureAddressForSdk } from '../util/address'
import { getBalanceContract } from './contract'
import useAddress from './useAddress'
import useSWR from 'swr'

export function useBalance(tokenAddr, options = {}) {
  const address = useAddress()
  return useSWR(
    address && tokenAddr ? ['useBalance', address, tokenAddr] : null,
    fetcher,
    { revalidateOnMount: true, ...options }
  ).data
}

function fetcher(key, address, tokenAddr) {
  console.log('useBalance fetcher')
  return getBalanceContract()
    .tokenBalance(ensureAddressForSdk(address), ensureAddressForSdk(tokenAddr))
    .call()
    .then((x) => {
      return x + ''
    })
}
