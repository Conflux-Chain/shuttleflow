import sponsorAbi from './TokenSponsor.json'
import custodianAbi from './CustodianImpl.json'
import balanceAbi from './Balance.json'
import tokenAbi from './TokenBase.json'
import {
  SPONSOR_CONTRACT_ADDR,
  CUSTODIAN_CONTRACT_ADDR,
} from '../../config/config'

const aaa = {
  eth_custodian_proxy_addr: '0x89ee646e8ec9184fde03d4a6f73ba5b198d07974',
  eth_token_sponsor_addr: '0x8f2c7ee9d8b541f9b821473ade5caed7ba78e319',
  cfx_to_eth_custodian_proxy_addr:
    'cfxtest:acb13s4261puun56amtwzfy0u8vft0apsph8hu7g61',
  cfx_to_eth_token_sponsor_addr:
    'cfxtest:acbjrt1zdnpf8xxknmxg2wruu1fbbagv5uawx0s1pk',
  bsc_custodian_proxy_addr:
    'cfxtest:acg8g810ntrv2wn62mjd7jn8brackkcc6pxv3u47ae',
  bsc_token_sponsor_addr: 'cfxtest:aca2kmezyet575cusyzhhp2jmwc1b4ka1ynevxeycf',
  cfx_to_bsc_custodian_proxy_addr:
    'cfxtest:acdbc6vygv2rcejrf59rga0b1ze52h94by3en9b77n',
  cfx_to_bsc_token_sponsor_addr:
    'cfxtest:acgw7pkuhvb8nk1a98jjzveugn7bkhj9za79hgwu4p',
}

const contractsABIs = {
  custodian: import('./CustodianImpl.json'),
}

// contractsABIs.eth_custodian.then((e) => {
//   console.log(e.default)
// })

function createGetContract(abi, address) {
  let contract
  return function getContract() {
    if (!contract) {
      const args = { abi }
      if (address) {
        args.address = address
      }
      contract = window.confluxJS.Contract(args)
    }
    // return contract
    return Promise.resolve(contract)
  }
}

export const getSponsorContract = createGetContract(
  sponsorAbi,
  SPONSOR_CONTRACT_ADDR
)
export const getCustodianContract = createGetContract(
  custodianAbi,
  CUSTODIAN_CONTRACT_ADDR
)

export const getBalanceContract = createGetContract(
  balanceAbi,
  '0x8f35930629fce5b5cf4cd762e71006045bfeb24d'
)

export const getTokenContract = createGetContract(tokenAbi)
