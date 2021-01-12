import { getSponsorContract } from './contract'

export default function getLatestMortgage(erc20) {
  return getSponsorContract()
    .sponsorValueOf(erc20)
    .call()
}
