import jsonrpc from './jsonrpc'
import { parseNum } from '../util/formatNum'
import btc from './bcoin.svg'
import eth from './ether.svg'
import Big from 'big.js'

const icons = {
  btc,
  eth,
}

const tokenList = jsonrpc('getTokenList', { url: 'sponsor' }).then((result) => {
  return result.map((d, i) => {
    // cToken的totalSupply和sponsor_value都是18位，除以1e18就行
    // 其他的都是decimal
    const {
      reference,
      symbol,
      reference_symbol,
      reference_name,
      sponsor_value,
      total_supply,
      decimals,
      minimal_burn_value,
      minimal_mint_value,
      in_token_list,
      mint_fee,
      burn_fee,
      wallet_fee,
      icon,
      ctoken,
    } = d
    const totalSupplyBig = total_supply && parseNum(total_supply, 18)

    return {
      ...d,
      id: reference + ctoken,
      symbol: symbol || '',
      reference_name: reference_name || '',
      reference_symbol: reference_symbol || '',
      total_supply: totalSupplyBig,
      _total_supply: totalSupplyBig && formatSupply(totalSupplyBig),
      sponsor_value: parseNum(sponsor_value, 18),

      minimal_burn_value: parseNum(minimal_burn_value, decimals),
      minimal_mint_value: parseNum(minimal_mint_value, decimals),
      mint_fee: parseNum(mint_fee, decimals),
      burn_fee: parseNum(burn_fee, decimals),
      wallet_fee: parseNum(wallet_fee, decimals),
      icon: icon || icons[reference],
      //btc and eth is not in gecko list,but they are trusted
      in_token_list: ['btc', 'eth'].indexOf(reference) > -1 ? 1 : in_token_list,
    }
  })
  // .filter((x) => x.reference === 'btc')
})

export default tokenList

export const tokenMap = tokenList.then((list) => {
  return list.reduce((pre, cur) => {
    pre[cur.id] = cur
    return pre
  }, {})
})

function formatSupply(totalSupplyBig) {
  let [p0, p1] = (totalSupplyBig + '').split('.')
  if (p1) {
    if (p0.length > 6) {
      p1 = ''
    } else if (p0.length > 3) {
      p1 = p1.slice(0, 2)
    } else {
      p1 = p1.slice(0, 4)
    }
  }
  //Big is used to remove trailing 0
  return new Big(p0 + (p1 ? `.${p1}` : '')) + ''
}
