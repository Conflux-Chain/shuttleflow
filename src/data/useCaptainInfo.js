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
    getCustodianContract().then((c) => {
      return Promise.all(
        [
          c.burn_fee(reference),
          c.mint_fee(reference),
          c.wallet_fee(reference),
          c.minimal_mint_value(reference),
          c.minimal_burn_value(reference),
          c.token_cooldown(reference),
          c.minimal_sponsor_amount(),
          c.default_cooldown(),
          c.safe_sponsor_amount(),
        ].map((fn) => fn.call())
      )
    }),
    getSponsorContract().then((c) => {
      return Promise.all(
        [c.sponsorOf(reference), c.sponsorValueOf(reference)].map((fn) =>
          fn.call()
        )
      )
    }),

    getBalanceContract().then((c) => {
      return c.tokenBalance(address, CHAIN_CONFIG[chain].cAddress).call()
    }),
  ]).then(([pendingInfo, custodianData, sponsorData, myBaclance]) => {
    console.log(pendingInfo, custodianData, sponsorData, myBaclance)
    const { cnt } = pendingInfo
    const [
      burn_fee,
      mint_fee,
      wallet_fee,
      minimal_mint_value,
      minimal_burn_value,
      token_cooldown,
      minimal_sponsor_amount,
      default_cooldown,
      safe_sponsor_amount,
    ] = custodianData.map((x) => Big(x + ''))

    const sponsor = sponsorData[0]
    const sponsorValue = Big(sponsorData[1] + '')

    console.log(
      [
        burn_fee,
        mint_fee,
        wallet_fee,
        minimal_mint_value,
        minimal_burn_value,
        token_cooldown,
        minimal_sponsor_amount,
        default_cooldown,
        safe_sponsor_amount,
      ].map((x) => x + '')
    )
    const diff = parseInt(Date.now() / 1000 - parseInt(token_cooldown))
    return {
      pendingCount: cnt,

      out_fee: burn_fee.div(`1e${decimals}`),
      in_fee: mint_fee.div(`1e${decimals}`),
      wallet_fee: wallet_fee.div(`1e${decimals}`),
      minimal_in_value: minimal_mint_value.div(`1e${decimals}`),
      minimal_out_value: minimal_burn_value.div(`1e${decimals}`),
      minMortgage: minimal_sponsor_amount,

      countdown: Math.max(0, parseInt(default_cooldown + '') - diff),
      cethBalance: Big(myBaclance + '').div('1e18'),
      sponsor,
      currentMortgage: sponsorValue.div('1e18'),
      safeSponsorAmount: safe_sponsor_amount.div('1e18'),
    }
  })
}
