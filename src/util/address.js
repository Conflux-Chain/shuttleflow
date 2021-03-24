import { IS_DEV } from '../config/config'
const confluxAddr = require('conflux-address-js')

function isNewCfxAddress(value) {
  let isNewCfxAddress
  try {
    confluxAddr.decode(value).hexAddress.toString('hex')
    isNewCfxAddress = true
  } catch (error) {
    isNewCfxAddress = false
  }
  return isNewCfxAddress
}

export function isAddress(value = '') {
  return /^0x[0-9a-fA-F]{40}$/.test(value) || isNewCfxAddress(value)
}

function formatEth(txt) {
  const first6 = txt.slice(0, 6)
  const last4 = txt.slice(txt.length - 4)
  return first6 + '...' + last4
}

function formatCfx(txt) {
  //not sure about verbose or not
  const parts = txt.split(':')
  const network = parts[0]
  const hex = parts[parts.length - 1]
  return `${network}:${hex.slice(0, 8)}...`
}

export function formatAddress(addr, { chain } = { chain: 'eth' }) {
  if (!addr) {
    return ''
  }
  if (chain === 'eth') {
    return formatEth(addr)
  } else if (chain === 'cfx') {
    try {
      addr = confluxAddr.encode(
        Buffer.from(addr.slice(2), 'hex'),
        IS_DEV ? 1 : 1029
      )
    } catch (e) {}
    return formatCfx(addr)
  } else {
    //address type is unpredictable due to mixed version of portal
    isNewCfxAddress(addr) ? formatCfx(addr) : formatEth(addr)
  }
}

export function isZeroAddress(addr) {
  return confluxAddr.decode(addr).type === 'null'
}
