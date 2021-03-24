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
  if (tokenAddr === 'cfx') {
    return window.confluxJS.getBalance(address).then((x) => {
      return x + ''
    })
  }
  console.log(address, tokenAddr)
  return getBalanceContract()
    .tokenBalance(address, tokenAddr)
    .call()
    .then((x) => {
      return x + ''
    })
}
