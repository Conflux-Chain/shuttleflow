import { IS_DEV } from './config'
import jsonrpc from '../data/jsonrpc'
var WAValidator = require('wallet-address-validator')

export const CAPTAIN = {
  NONE: 0,
  TO_CFX: 1,
  TO_REF: 2,
  BOTH: 3,
}
const config = {
  btc: {
    captain: CAPTAIN.NONE,
    // set the singleton one as default when no token selected
    singleToken: true,
    outFormatCheck(address) {
      console.log('outFormatCheck', address)
      return WAValidator.validate(
        address,
        'bitcoin',
        IS_DEV ? 'testnet' : 'prod'
      )
    },
    checkAddress() {
      return Promise.resolve('yes')
    },
  },
  eth: {
    captain: CAPTAIN.TO_CFX,
    outFormatCheck(address) {
      return WAValidator.validate(
        address,
        'ethereum',
        IS_DEV ? 'testnet' : 'prod'
      )
    },
    checkAddress(address = '', blockShuttleout, t) {
      if (address.startsWith('0x1')) {
        return jsonrpc('getEthNonce', {
          url: 'sponsor',
          params: [address],
        })
          .then((x) => {
            if (x > 0) {
              return 'eth'
            } else {
              return window.confluxJS.getNextNonce(address).then((x) => {
                if (x.toString() === '0') {
                  return 'tbd'
                } else {
                  return 'conflux'
                }
              })
            }
          })
          .then((x) => {
            return new Promise((resolve) => {
              if (x === 'eth') {
                resolve('yes')
              } else {
                blockShuttleout(resolve, t(`confirm.${x}`))
              }
            })
          })
      } else {
        return Promise.resolve('yes')
      }
    },
    frequentTokens: [
      'btc',
      'eth',
      '0xdac17f958d2ee523a2206206994597c13d831ec7', //usdt
      '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', //usdc
    ],
  },
}

export default config
