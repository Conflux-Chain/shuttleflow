import jsonrpc from './jsonrpc'
export default function checkAddress(address = '') {
  if (address.startsWith('0x1')) {
    return jsonrpc('getEthNonce', { url: 'sponsor', params: [address] }).then(
      (x) => {
        if (x > 0) {
          return 'eth'
        } else {
          return window.confluxJS.getNextNonce(address).then((x) => {
            console.log(x, x.toString())
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

// window.checkAddress = checkAddress

// checkAddress('0x197e4379f8b2147859466a6be9d1d098955ffcd1').then((x) => {
//   console.log(x)
// })
