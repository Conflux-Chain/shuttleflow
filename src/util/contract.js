import { IS_DEV } from "../config/config";
import ERC20_ABI from "../constants/abis/erc20.json";
import DEPOSIT_RELAYER_ABI from "../constants/abis/depositRelayerABI.json";
const TESTNET_ETH_DEPOSIT_RELAYER_ADDRESS =
  "0x2f9bd2eeb09a006adf39a33b8782aaf4c7c84b63";
const MAINNET_ETH_DEPOSIT_RELAYER_ADDRESS =
  "0x02a9656f6851527e2199ce0ad3c15adddbaf734f";
const TESTNET_BSC_DEPOSIT_RELAYER_ADDRESS =
  "0x95edfd5fd720ace4cd585a469e5d8f12a448e27c";
const MAINNET_BSC_DEPOSIT_RELAYER_ADDRESS =
  "0x50468a03643ae9664c3c40b2bdcd4ebc8a6bc1f3";

const TESTNET_OEC_DEPOSIT_RELAYER_ADDRESS = "0x5cF9C20DE32aE58d33Cb8C22e73d9b2B2E886AdA";
const MAINNET_OEC_DEPOSIT_RELAYER_ADDRESS = "0x214c2958C04150846A442A7b977F9f190B603F31";

export const ETH_DEPOSIT_RELAYER_CONTRACT_ADDRESS = IS_DEV
  ? TESTNET_ETH_DEPOSIT_RELAYER_ADDRESS
  : MAINNET_ETH_DEPOSIT_RELAYER_ADDRESS;
export const BSC_DEPOSIT_RELAYER_CONTRACT_ADDRESS = IS_DEV
  ? TESTNET_BSC_DEPOSIT_RELAYER_ADDRESS
  : MAINNET_BSC_DEPOSIT_RELAYER_ADDRESS;
export const OEC_DEPOSIT_RELAYER_CONTRACT_ADDRESS = IS_DEV
  ? TESTNET_OEC_DEPOSIT_RELAYER_ADDRESS
  : MAINNET_OEC_DEPOSIT_RELAYER_ADDRESS;

import { getContract } from "./index";
export function getTokenContract(address, library, account) {
  return getContract(address, ERC20_ABI, library, account);
}
export function getDepositRelayerContract(chain, library, account) {
  let address = getDepositRelayerAddressChain(chain);
  return getContract(address, DEPOSIT_RELAYER_ABI, library, account);
}

export function getDepositRelayerAddressChain(chain) {
  let address = "";
  switch (chain) {
    case "eth":
      address = ETH_DEPOSIT_RELAYER_CONTRACT_ADDRESS;
      break;
    case "bsc":
      address = BSC_DEPOSIT_RELAYER_CONTRACT_ADDRESS;
      break;
    case "oec":
      address = OEC_DEPOSIT_RELAYER_CONTRACT_ADDRESS;
      break;
  }
  return address;
}
