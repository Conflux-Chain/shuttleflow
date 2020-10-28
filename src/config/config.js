let CONFLUXSCAN_URL
export let EHTHERSCAN_URL,
  EHTHERSCAN_TX,
  EHTHERSCAN_TK,
  CONFLUXSCAN_TX,
  CONFLUXSCAN_TK,
  CUSTODIAN_CONTRACT_ADDR,
  NODE_URL,
  SPONSOR_URL

//dev
if (true) {
  EHTHERSCAN_URL = 'https://rinkeby.etherscan.io'
  CONFLUXSCAN_URL = 'https://confluxscan.io'
  NODE_URL = '/rpcshuttleflow'
  SPONSOR_URL = '/rpcsponsor'
  CUSTODIAN_CONTRACT_ADDR = '0x897c185209ed461070db137ae34b18f467bef8a8'
} else {
  //prod
  EHTHERSCAN_URL = 'https://etherscan.io'
  EHTHERSCAN_URL = 'https://confluxscan.io'
}

EHTHERSCAN_TX = EHTHERSCAN_URL + '/tx/'
EHTHERSCAN_TK = EHTHERSCAN_URL + '/token/'

CONFLUXSCAN_TX = CONFLUXSCAN_URL + '/transactionsdetail/'
CONFLUXSCAN_TK = CONFLUXSCAN_URL + '/token/'
