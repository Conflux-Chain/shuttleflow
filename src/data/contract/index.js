import sponsorAbi from './TokenSponsor.json'
import custodianAbi from './CustodianImpl.json'
import {
  SPONSOR_CONTRACT_ADDR,
  CUSTODIAN_CONTRACT_ADDR,
} from '../../config/config'
let sponsorContract, custodianContract

export function getSponsorContract() {
  if (!sponsorContract) {
    sponsorContract = window.confluxJS.Contract({
      abi: sponsorAbi,
      address: SPONSOR_CONTRACT_ADDR,
    })
  }
  return sponsorContract
}

export function getCustodianContract() {
  if (!custodianContract) {
    custodianContract = window.confluxJS.Contract({
      abi: custodianAbi,
      address: CUSTODIAN_CONTRACT_ADDR,
    })
  }
  return custodianContract
}
