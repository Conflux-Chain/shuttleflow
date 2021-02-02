import { ensureAddressForSdk } from '../util/address'
import { getSponsorContract } from './contract'

export default function getLatestMortgage(reference) {
  return getSponsorContract().sponsorValueOf(ensureAddressForSdk(reference)).call()
}
