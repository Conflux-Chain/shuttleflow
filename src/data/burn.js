import { ensureAddressForSdk } from '../util/address'
import { getTokenContract } from './contract'

export default function burn(addr, ctoken, amount, burnfee) {
  const selectedAddress = window.conflux.selectedAddress
  return getTokenContract()
    .burn(
      ensureAddressForSdk(selectedAddress),
      amount,
      burnfee,
      addr,
      '0x0000000000000000000000000000000000000000'
    )
    .sendTransaction({ from: selectedAddress, to: ctoken })
}
