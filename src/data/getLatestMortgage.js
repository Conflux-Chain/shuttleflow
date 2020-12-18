import sponsorAbi from './abi/TokenSponsor.json'
import { SPONSOR_CONTRACT_ADDR } from '../config/config'

export default function getLatestMortgage(erc20) {
    console.log(window.confluxJS)
  return window.confluxJS
    .Contract({ abi: sponsorAbi })
    .sponsorValueOf(erc20)
    .call({ to: SPONSOR_CONTRACT_ADDR })
}
