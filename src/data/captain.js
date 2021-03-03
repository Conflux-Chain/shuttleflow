import jsonrpc from './jsonrpc'
import { getCustodianContract, getSponsorContract } from './contract'
import { ensureAddressForSdk } from '../util/address'
import { getBalanceContract } from './contract'
import Big from 'big.js'
import useSWR from 'swr'
import useAddress from './useAddress'
import CHAIN_CONFIG from '../config/chainConfig'
import { useParams } from 'react-router'

//txHash is used to flush data from server
export default function useCaptain(reference, txHash) {
  const address = useAddress()
  const { chain } = useParams()
  return useSWR(['captain', reference, address, chain], fetcher, {
    suspense: true,
  }).data
}

function fetcher(key, reference, address, chain) {
  console.log('')
  return Promise.all([
    jsonrpc('getPendingOperationInfo', {
      url: 'node',
      params: [reference],
    }),
    getCustodianContract()
      .token_cooldown(ensureAddressForSdk(reference))
      .call(),
    getCustodianContract().minimal_sponsor_amount().call(),
    getCustodianContract().default_cooldown().call(),
    getSponsorContract().sponsor_replace_ratio().call(),
    getBalanceContract()
      .tokenBalance(
        ensureAddressForSdk(address),
        ensureAddressForSdk(CHAIN_CONFIG[chain].cAddress)
      )
      .call()
      .then((x) => {
        return x + ''
      }),
    getSponsorContract().sponsorValueOf(ensureAddressForSdk(reference)).call(),
  ]).then(
    ([
      { cnt = 0 } = {},
      cooldown,
      minMortgage,
      defaultCooldown,
      replaceRatio,
      cethBalance,
      currentMortgage,
    ]) => {
      const cooldownMinutes = parseInt(defaultCooldown) / 60
      const diff = parseInt(Date.now() / 1000 - parseInt(cooldown))
      return {
        cooldownMinutes,
        pendingCount: cnt,
        minMortgage: minMortgage + '',
        // A percent ratio when a user want to replace the sponsor of a token t,
        // he/she must mortgage more than token_sponsor_value[t]*(100+sponsor_replace_ratio)/100 cETH.
        replaceRatio: Big(replaceRatio + '')
          .add('100')
          .div('100'),
        countdown: Math.max(0, parseInt(defaultCooldown + '') - diff),
        cethBalance,
        currentMortgage,
      }
    }
  )
}
