//dev has two different(confusing) meaning here
//1) The testnet is connected
//2) The website is internal and test only
//the two meaning is not related by nature and the
//relation will break when the testnet is stable
export const IS_DEV =
  window.location.hostname === 'localhost' ||
  window.location.hostname.indexOf('test') > -1

let CONFLUXSCAN_URL
export let CONFLUXSCAN_TX,
  CONFLUXSCAN_TK,
  CONFLUXSCAN_ADDR,
  CUSTODIAN_CONTRACT_ADDR,
  SPONSOR_CONTRACT_ADDR,
  NODE_URL = '/rpcshuttleflow',
  SPONSOR_URL = '/rpcsponsor',
  ZERO_ADDR

//dev
if (IS_DEV) {
  CONFLUXSCAN_URL = 'http://testnet.confluxscan.io'
  CUSTODIAN_CONTRACT_ADDR = '0x89ee646e8ec9184fde03d4a6f73ba5b198d07974'
  SPONSOR_CONTRACT_ADDR = '0x8f2c7ee9d8b541f9b821473ade5caed7ba78e319'
  ZERO_ADDR = 'cfxtest:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6f0vrcsw'
} else {
  //prod
  CONFLUXSCAN_URL = 'https://confluxscan.io'
  CUSTODIAN_CONTRACT_ADDR = '0x890e3feac4a2c33d7594bc5be62e7970ef5481e0'
  SPONSOR_CONTRACT_ADDR = '0x8a129cde0a730fb0b8e355e3e18a5361d138a958'
  ZERO_ADDR = 'cfx:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0sfbnjm2'
}

CONFLUXSCAN_TX = CONFLUXSCAN_URL + '/transaction/'
CONFLUXSCAN_TK = CONFLUXSCAN_URL + '/token/'
CONFLUXSCAN_ADDR = CONFLUXSCAN_URL + '/address'

export const DEFAULT_CHAIN = 'eth'

export const NETWORKS = {
  1: 'test',
  1029: 'main',
}
