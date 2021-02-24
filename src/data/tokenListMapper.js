import { parseNum } from '../util/formatNum'
import Big from 'big.js'
import CHAIN_CONFIG from '../config/chainConfig'

export default function tokenListMapper(d) {
  const {
    reference,
    symbol,
    reference_symbol,
    reference_name,

    total_supply,
    decimals,
    icon,
    in_token_list,
    id,
    origin = 'eth',
    name,
  } = d

  let {
    minimal_burn_value,
    minimal_mint_value,
    mint_fee,
    burn_fee,
    wallet_fee,
    sponsor_value,
  } = d

  delete d.minimal_burn_value
  delete d.minimal_mint_value
  delete d.mint_fee
  delete d.burn_fee
  delete d.total_supply
  const totalSupplyBig = total_supply && parseNum(total_supply, 18)
  //18 is the decimal of cXXX token which is always 18 decimals
  sponsor_value = parseNum(sponsor_value, 18)
  const values = {
    minimal_burn_value: parseNum(minimal_burn_value, decimals),
    minimal_mint_value: parseNum(minimal_mint_value, decimals),
    mint_fee: parseNum(mint_fee, decimals),
    burn_fee: parseNum(burn_fee, decimals),
  }

  const toCFX = origin !== 'cfx'
  const _out = toCFX ? 'burn' : 'mint'
  const _in = toCFX ? 'mint' : 'burn'

  return {
    ...d,
    id: id + '',
    symbol: symbol || '',
    reference_name: reference_name || '',
    reference_symbol: reference_symbol || '',
    // total_supply: totalSupplyBig,
    _total_supply: totalSupplyBig && formatSupply(totalSupplyBig),
    sponsor_value,

    // minimal_burn_value: parseNum(minimal_burn_value, decimals),
    // minimal_mint_value: parseNum(minimal_mint_value, decimals),
    // mint_fee: parseNum(mint_fee, decimals),
    // burn_fee: parseNum(burn_fee, decimals),
    minimal_in_value: values[`minimal_${_in}_value`],
    minimal_out_value: values[`minimal_${_out}_value`],
    in_fee: values[`${_in}_fee`],
    out_fee: values[`${_out}_fee`],
    wallet_fee: parseNum(wallet_fee, decimals),
    icon: icon || CHAIN_CONFIG[reference].icon,
    name: name || 'Conflux ' + reference_name,
    //btc and eth is not in gecko list,but they are trusted
    in_token_list: ['btc', 'eth'].indexOf(reference) > -1 ? 1 : in_token_list,
  }
}
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
