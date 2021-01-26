import { IS_DEV } from '../config/config'

const confluxAddr = require('conflux-address-js')

// const confluxAddr = require('conflux-address-js')
const hexBuffer = Buffer.from('106d49f8505410eb4e671d51f7d96d2c87807b09', 'hex')
const netId = 1029 // Conflux main-net

// console.log(confluxAddr.encode(hexBuffer, netId))

// console.log(
//   confluxAddr
//     .decode('cfx:aajg4wt2mbmbb44sp6szd783ry0jtad5bea80xdy7p')
//     .hexAddress.toString('hex')
// )
export function isAddress(value = '') {
  let isCfxAddress
  try {
    confluxAddr.decode(value).hexAddress.toString('hex')
    isCfxAddress = true
  } catch (error) {
    isCfxAddress = false
  }
  return /^0x[0-9a-fA-F]{40}$/.test(value) || isCfxAddress
}

export function ensureAddressForSdk(oldOrNewAddress) {
  const isNew = window.ConfluxJSSDK.format.hexAddress
  if (isNew) {
    try {
      if (
        oldOrNewAddress.startsWith('0x') ||
        oldOrNewAddress.startsWith('0X')
      ) {
        oldOrNewAddress = oldOrNewAddress.slice(2)
      }

      const addr = confluxAddr.encode(
        Buffer.from(oldOrNewAddress, 'hex'),
        IS_DEV ? 1 : 1029
      )
      return addr
    } catch (e) {
      return oldOrNewAddress
    }
  } else {
    try {
      const addr =
        '0x' + confluxAddr.decode(oldOrNewAddress).hexAddress.toString('hex')
      return addr
    } catch (e) {
      return oldOrNewAddress
    }
  }
}

window.ensureAddressForSdk = ensureAddressForSdk
