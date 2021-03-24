import { getSponsorContract } from './contract'

export default function getLatestMortgage(reference) {
  return getSponsorContract().sponsorValueOf(reference).call()
}
