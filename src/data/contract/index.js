import sponsorAbi from './TokenSponsor.json'
import custodianAbi from './CustodianImpl.json'
import balanceAbi from './Balance.json'
import {
  SPONSOR_CONTRACT_ADDR,
  CUSTODIAN_CONTRACT_ADDR,
} from '../../config/config'
let sponsorContract, custodianContract, balanceContract

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

export function getBalanceContract() {
  if (!balanceContract) {
    balanceContract = window.confluxJS.Contract({
      abi: balanceAbi,
      address: '0x8f35930629fce5b5cf4cd762e71006045bfeb24d',
    })
  }
  return balanceContract
}
