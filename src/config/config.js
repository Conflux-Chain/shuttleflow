let CONFLUXSCAN_URL
export let EHTHERSCAN_URL,
  EHTHERSCAN_TX,
  EHTHERSCAN_TK,
  CONFLUXSCAN_TX,
  CONFLUXSCAN_TK,
  CUSTODIAN_CONTRACT_ADDR,
  NODE_URL = '/rpcshuttleflow',
  SPONSOR_URL = '/rpcsponsor'

//dev
if (
  ['localhost', 'shuttleflowtest.confluxnetwork.org'].indexOf(
    window.location.hostname
  ) > -1
) {
  EHTHERSCAN_URL = 'https://rinkeby.etherscan.io'
  CONFLUXSCAN_URL = 'http://testnet.confluxscan.io'
  CUSTODIAN_CONTRACT_ADDR = '0x8248210d7d45791607afb09fe4309c557202faf7'
} else {
  //prod
  EHTHERSCAN_URL = 'https://etherscan.io'
  CONFLUXSCAN_URL = 'https://confluxscan.io'
  CUSTODIAN_CONTRACT_ADDR = '0x890e3feac4a2c33d7594bc5be62e7970ef5481e0'
}

//production env

EHTHERSCAN_TX = EHTHERSCAN_URL + '/tx/'
EHTHERSCAN_TK = EHTHERSCAN_URL + '/token/'

CONFLUXSCAN_TX = CONFLUXSCAN_URL + '/transaction/'
CONFLUXSCAN_TK = CONFLUXSCAN_URL + '/token/'
