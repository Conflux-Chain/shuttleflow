import jsonrpc from './jsonrpc'
export default function checkAddress(address = '') {
  if (address.startsWith('0x1')) {
    return jsonrpc('getEthNonce', { url: 'sponsor', params: [address] }).then(
      (x) => {
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
      }
    )
  } else {
    return Promise.resolve('eth')
  }
}


