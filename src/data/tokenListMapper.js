import { parseNum } from '../util/formatNum'
import Big from 'big.js'
import CHAIN_CONFIG from '../config/chainConfig'

export default function tokenListMapper(d) {
  const {
    reference,
    symbol,
    reference_symbol,
    reference_name,
    ctoken,
    total_supply,
    icon,
    in_token_list,
    name,
  } = d

  let {
    sponsor_value,
    origin,
    to_chain,
  } = d

  delete d.minimal_burn_value
  delete d.minimal_mint_value
  delete d.mint_fee
  delete d.burn_fee
  delete d.total_supply
  delete d.id
  const totalSupplyBig = total_supply && parseNum(total_supply, 18)
  //18 is the decimal of cXXX token which is always 18 decimals
  sponsor_value = parseNum(sponsor_value, 18)
  const toCFX = origin !== 'cfx'
  const nonCfxChain = toCFX ? origin : to_chain

  return {
    ...d,
    name: name || 'Conflux ' + reference_name,
    symbol: symbol || 'c' + reference_symbol,
    //Todo: name and symbol is chain related if the origin is conflux
    reference_name: reference_name || nonCfxChain + ' ' + name,
    reference_symbol:
      reference_symbol || nonCfxChain.slice(0, 1) + ' ' + symbol,
    _total_supply: totalSupplyBig && formatSupply(totalSupplyBig),
    sponsor_value,
    icon: icon || CHAIN_CONFIG[reference].icon,
    reference: reference || 'null',
    ctoken: ctoken || 'null',

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
