import sponsorAbi from './TokenSponsor.json'
import custodianAbi from './CustodianImpl.json'
import balanceAbi from './Balance.json'
import tokenAbi from './TokenBase.json'
// import erc20Abi from './ERC20Baisc.json'
import {
  SPONSOR_CONTRACT_ADDR,
  CUSTODIAN_CONTRACT_ADDR,
} from '../../config/config'


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
    return contract
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
// export const getErc20Contract = createGetContract(erc20Abi)
