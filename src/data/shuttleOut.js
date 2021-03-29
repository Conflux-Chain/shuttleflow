import { getContract } from './contract/contract'
import jsonrpc from './jsonrpc'
export default function shuttleout(tokenInfo, amount, externalAddress, chain) {
  const selectedAddress = window.conflux.selectedAddress
  const { origin, ctoken, out_fee: burnfee, decimals } = tokenInfo
  if (origin === 'cfx') {
    amount = amount.mul(`1e${decimals}`)
    return jsonrpc('getUserWallet', {
      url: 'node',
      params: [
        externalAddress,
        '0x0000000000000000000000000000000000000000',
        'cfx',
        chain,
        'out',
      ],
    }).then((address) => {
      if (ctoken === 'cfx') {
        return window.confluxJS.sendTransaction({
          from: selectedAddress,
          to: address,
          value: amount.mul(),
        })
      } else {
        return getContract('erc777').then((c) => {
          return c.transfer(address, amount).sendTransaction({
            from: selectedAddress,
            to: ctoken,
          })
        })
      }
    })
  } else {
    amount = amount.mul(`1e18`)
    return getContract('erc777').then((c) => {
      return c
        .burn(
          selectedAddress,
          amount,
          burnfee.mul('1e18'),
          externalAddress,
          '0x0000000000000000000000000000000000000000'
        )
        .sendTransaction({ from: selectedAddress, to: ctoken })
    })
  }
}
