export let EHTHERSCAN_URL,
  EHTHERSCAN_TX,
  CONFLUXSCAN_URL,
  CONFLUXSCAN_TX,
  CUSTODIAN_CONTRACT_ADDR,
  NODE_URL,
  SPONSOR_URL

//dev
if (true) {
  EHTHERSCAN_URL = 'https://rinkeby.etherscan.io'
  CONFLUXSCAN_URL = 'https://confluxscan.io'
  NODE_URL = 'https://dev.shuttleflow.io'
  SPONSOR_URL = 'http://23.102.224.244:8018'
  CUSTODIAN_CONTRACT_ADDR = '0x897c185209ed461070db137ae34b18f467bef8a8'
} else {
  //prod
  EHTHERSCAN_URL = 'https://etherscan.io'
  EHTHERSCAN_URL = 'https://confluxscan.io'
}

EHTHERSCAN_TX = EHTHERSCAN_URL + '/tx/'
CONFLUXSCAN_TX = CONFLUXSCAN_URL + '/transactionsdetail/'
