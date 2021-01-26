import { ensureAddressForSdk } from '../util/address'
import { getSponsorContract } from './contract'

export default function getLatestMortgage(erc20) {
  return getSponsorContract().sponsorValueOf(ensureAddressForSdk(erc20)).call()
}
