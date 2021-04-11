//dev has two different(confusing) meaning here
//1) The testnet is connected
//2) The website is internal and test only
//the two meaning is not related by nature and the
//relation will break when the testnet is stable
export const IS_DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname.indexOf("test") > -1;

export let CONFLUXSCAN_TX,
  CONFLUXSCAN_TK,
  CONFLUXSCAN_ADDR,
  CUSTODIAN_CONTRACT_ADDR,
  SPONSOR_CONTRACT_ADDR,
  NODE_URL = "/rpcshuttleflow",
  SPONSOR_URL = "/rpcsponsor",
  ZERO_ADDR,
  ZERO_ADDR_HEX = "0x0000000000000000000000000000000000000000",
  ETHSCAN_TX,
  ETHSCAN_TK,
  BSCSCAN_TX,
  BSCSCAN_TK,
  CONFLUXSCAN_URL,
  ETH_SCAN_URL,
  BSC_SCAN_URL;
//dev
if (IS_DEV) {
  CONFLUXSCAN_URL = "http://testnet.confluxscan.io";
  ZERO_ADDR = "cfxtest:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6f0vrcsw";
  ETH_SCAN_URL = "https://rinkeby.etherscan.io";
  BSC_SCAN_URL = "https://testnet.bscscan.com";
} else {
  //prod
  CONFLUXSCAN_URL = "https://confluxscan.io";
  ZERO_ADDR = "cfx:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0sfbnjm2";
  ETH_SCAN_URL = "https://etherscan.io";
  BSC_SCAN_URL == "https://bscscan.com";
}

CONFLUXSCAN_TX = CONFLUXSCAN_URL + "/transaction/";
CONFLUXSCAN_TK = CONFLUXSCAN_URL + "/token/";
CONFLUXSCAN_ADDR = CONFLUXSCAN_URL + "/address";

ETHSCAN_TX = ETH_SCAN_URL + "/tx/";
ETHSCAN_TK = ETH_SCAN_URL + "/token/";

BSCSCAN_TX = BSC_SCAN_URL + "/tx/";
BSCSCAN_TK = BSC_SCAN_URL + "/token/";

export const DEFAULT_CHAIN = "eth";

export const NETWORKS = {
  1: "test",
  1029: "main",
};

export const CHAINID={
  ETHEREUM_MAINNET:1,
  ETHEREUM_RINKEBY:4,
  BSC_MAINNEET:56,
  BSC_TESTNET:97
}
export const MetaMask_WEBSITE='https://metamask.io'