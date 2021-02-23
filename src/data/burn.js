import { ensureAddressForSdk } from '../util/address'
import { getTokenContract } from './contract'

export default function burn(addr, ctoken, amount, burnfee) {
  let selectedAddress = window.conflux.selectedAddress

  ctoken = ensureAddressForSdk(ctoken)
  selectedAddress = ensureAddressForSdk(selectedAddress)

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
