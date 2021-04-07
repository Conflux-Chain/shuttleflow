import { IS_DEV } from '../config/config'
const confluxAddr = require('conflux-address-js')

export function isCfxAddress(value) {
  let _isCfxAddress
  try {
    confluxAddr.decode(value).hexAddress.toString('hex')
    _isCfxAddress = true
  } catch (error) {
    _isCfxAddress = false
  }
  return _isCfxAddress
}

export function isAddress(value = '') {
  return /^0x[0-9a-fA-F]{40}$/.test(value) || isCfxAddress(value)
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
    return formatCfx(addr)
  } else {
    //address type is unpredictable due to mixed version of portal
    isCfxAddress(addr) ? formatCfx(addr) : formatEth(addr)
  }
}

export function isZeroAddress(addr) {
  return confluxAddr.decode(addr).type === 'null'
}
