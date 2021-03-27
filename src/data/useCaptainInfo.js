import jsonrpc from './jsonrpc'
import { getCustodianContract, getSponsorContract } from './contract'
import { getBalanceContract } from './contract'
import Big from 'big.js'
import useSWR from 'swr'
import useAddress from './useAddress'
import CHAIN_CONFIG from '../config/chainConfig'
import { useParams } from 'react-router'

//txHash is used to flush data from server
export default function useCaptain(tokenInfo) {
  const address = useAddress()
  const { chain } = useParams()
  return useSWR(
    //todo hard code eth
    tokenInfo && chain === 'eth'
      ? [
          'captain',
          tokenInfo.reference,
          address,
          chain,
          tokenInfo.decimals,
          tokenInfo.origin,
        ]
      : null,
    fetcher,
    {
      suspense: true,
    }
  ).data
}

//todo: Shuttle in/out page still read from API rather than the contract
//some level of inconsistancy, tend to be fixed when reverse captain roll out
//The meaning of mint/burn and in/out is a mess currectly
//expect to be sorted out in the future
function fetcher(key, reference, address, chain, decimals, origin) {
  return Promise.all([
    jsonrpc('getPendingOperationInfo', {
      url: 'node',
      params: [reference],
    }),
    getCustodianContract().token_cooldown(reference).call(),
    getCustodianContract().minimal_sponsor_amount().call(),
    getCustodianContract().default_cooldown().call(),
    getSponsorContract().sponsorOf(reference).call(),
    getBalanceContract()
      .tokenBalance(address, CHAIN_CONFIG[chain].cAddress)
      .call(),

    getSponsorContract().sponsorValueOf(reference).call(),
    getCustodianContract().safe_sponsor_amount().call(),

    getCustodianContract().burn_fee(reference).call(),
    getCustodianContract().mint_fee(reference).call(),
    getCustodianContract().wallet_fee(reference).call(),
    getCustodianContract().minimal_mint_value(reference).call(),
    getCustodianContract().minimal_burn_value(reference).call(),
  ]).then(
    ([
      { cnt = 0 } = {},
      cooldown,
      minMortgage,
      defaultCooldown,
      sponsor,
      cethBalance,
      currentMortgage,
      safeSponsorAmount,
      burn_fee,
      mint_fee,
      wallet_fee,
      minimal_mint_value,
      minimal_burn_value,
    ]) => {
      console.log('currentMortgage', currentMortgage + '')
      console.log('safeSponsorAmount', safeSponsorAmount + '')

      const cooldownMinutes = parseInt(defaultCooldown) / 60
      const diff = parseInt(Date.now() / 1000 - parseInt(cooldown))
      return {
        cooldownMinutes,
        pendingCount: cnt,
        minMortgage: minMortgage + '',
        countdown: Math.max(0, parseInt(defaultCooldown + '') - diff),
        cethBalance: Big(cethBalance + '').div('1e18'),
        sponsor,
        currentMortgage: Big(currentMortgage + '').div('1e18'),
        safeSponsorAmount: Big(safeSponsorAmount + '').div('1e18'),
        out_fee: Big(burn_fee + '').div(`1e${decimals}`),
        in_fee: Big(mint_fee + '').div(`1e${decimals}`),
        wallet_fee: Big(wallet_fee + '').div(`1e${decimals}`),
        minimal_in_value: Big(minimal_mint_value + '').div(`1e${decimals}`),
        minimal_out_value: Big(minimal_burn_value + '').div(`1e${decimals}`),
      }
    }
  )
}
