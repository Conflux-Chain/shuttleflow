import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import Big from "big.js";
import { MIN_ETH, MIN_BSC } from "./../config/config";
// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

// add 10%
export function calculateGasMargin(value) {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

// account is not optional
export function getSigner(library, account) {
  console.log("=test=");
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export function calculateBalance(bignumber, decimals) {
  return Big(bignumber).div(`1e${decimals}`);
}
export function maxAmountSpend(amount, chain) {
  let minAmount = MIN_ETH;
  switch (chain) {
    case "eth":
      minAmount = MIN_ETH;
      break;
    case "bsc":
      minAmount = MIN_BSC;
      break;
  }
  if (amount.gt(minAmount)) {
    return amount.minus(minAmount);
  } else {
    return Big(0);
  }
}
