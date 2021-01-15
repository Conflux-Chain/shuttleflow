import { getTokenContract } from './contract'

export default function burn(addr, ctoken, amount, burnfee) {
  const selectedAddress = window.conflux.selectedAddress
  return getTokenContract()
    .burn(
      selectedAddress,
      amount,
      burnfee,
      addr,
      '0x0000000000000000000000000000000000000000'
    )
    .sendTransaction({ from: selectedAddress, to: ctoken })
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
