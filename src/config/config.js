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
// if (true) {
//   EHTHERSCAN_URL = 'https://rinkeby.etherscan.io'
//   CONFLUXSCAN_URL = 'http://scantest.confluxnetwork.org'
//   CUSTODIAN_CONTRACT_ADDR = '0x897c185209ed461070db137ae34b18f467bef8a8'
// } else {
//   //prod
//   EHTHERSCAN_URL = 'https://etherscan.io'
//   EHTHERSCAN_URL = 'https://confluxscan.io'
// }

EHTHERSCAN_URL = 'https://etherscan.io'
EHTHERSCAN_URL = 'https://confluxscan.io'
//production env
CUSTODIAN_CONTRACT_ADDR = '0x890e3feac4a2c33d7594bc5be62e7970ef5481e0'

EHTHERSCAN_TX = EHTHERSCAN_URL + '/tx/'
EHTHERSCAN_TK = EHTHERSCAN_URL + '/token/'

CONFLUXSCAN_TX = CONFLUXSCAN_URL + '/transaction/'
CONFLUXSCAN_TK = CONFLUXSCAN_URL + '/token/'
