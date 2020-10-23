import jsonrpc from './jsonrpc'
import format from './formatNum'
import btc from './bcoin.svg'
import eth from './ether.svg'

const icons = {
  btc,
  eth,
}

const tokenList = jsonrpc('getTokenList', { url: 'sponsor' }).then((result) => {
  console.log(result)
  return result.map((d) => {
    // cToken的totalSupply和sponsor_value都是18位，除以1e18就行
    // 其他的都是decimal
    //todo symbol is undefined currently
    const {
      reference,
      // reference_symbol,
      sponsor_value,
      total_supply,
      decimals,
      minimal_burn_value,
      minimal_mint_value,
      mint_fee,
      burn_fee,
      wallet_fee,
      icon,
    } = d
    return {
      ...d,
      // symbol: 'c' + reference_symbol,
      total_supply: format(total_supply, 18),
      sponsor_value: format(sponsor_value, 18),
      minimal_burn_value: format(minimal_burn_value, decimals),
      minimal_mint_value: format(minimal_mint_value, decimals),
      mint_fee: format(mint_fee, decimals),
      burn_fee: format(burn_fee, decimals),
      wallet_fee: format(wallet_fee, decimals),
      icon: icon || icons[reference],
    }
  })
})

export const tokenMap = tokenList.then((list) => {
  return list.reduce((pre, cur) => {
    pre[cur.reference] = cur
    return pre
  }, {})
})

export default tokenList
