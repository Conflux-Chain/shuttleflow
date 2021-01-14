import Big from 'big.js'
import { CUSTODIAN_CONTRACT_ADDR } from '../config/config'
import { getTokenContract } from './contract'

export default function burn(ref, amount, burnfee) {
  const selectedAddress = window.conflux.selectedAddress
  return getTokenContract()
    .burn(
      selectedAddress,
      Big(amount).mul('1e18'),
      burnfee,
      CUSTODIAN_CONTRACT_ADDR,
      '0x0000000000000000000000000000000000000000'
    )
    .sendTransaction({ from: selectedAddress, to: ref })
}

// const burn1 = (
//   amount,
//   externalAddr,
//   defiRelayer = '0x0000000000000000000000000000000000000000'
// ) => {
//   amount = Big(amount).times(1e18).toFixed()
//   return userAddr && refTokenBurnFee
//     ? c
//         ?.burn(userAddr, amount, refTokenBurnFee, externalAddr, defiRelayer)
//         ?.sendTransaction({ from: userAddr, to: contractAddr })
//     : Promise.reject('portal not installed')
// }
