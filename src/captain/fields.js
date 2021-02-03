import { big } from '../lib/yup/BigNumberSchema'

const basicValidate = () => {
  return big().typeError('error.number').aboveZero('error.above-zero')
}

export default function getFields({
  reference_symbol,
  symbol,

  out_fee,
  in_fee,
  minimal_out_value,
  minimal_in_value,
  countdown,
  decimals,
  wallet_fee,
  showMortgage,
  cethBalanceBig,
  defaultMortgageBig,
}) {
  symbol = symbol || 'c' + reference_symbol.toUpperCase()
  return [
    {
      name: 'mint_fee',
      label: 'shuttle-in-fee',
      unit: symbol,
      decimals,
      validate: basicValidate(),
      defaultValue: in_fee,
      readOnly: countdown !== 0,
    },
    {
      label: 'shuttle-in-amount',
      unit: reference_symbol,
      name: 'minimal_mint_value',
      defaultValue: minimal_in_value,
      validate: basicValidate().greaterThan('mint_fee', 'error.above-in-fee'),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'shuttle-out-fee',
      unit: symbol,
      name: 'burn_fee',
      defaultValue: out_fee,
      validate: basicValidate(),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'shuttle-out-amount',
      unit: symbol,
      name: 'minimal_burn_value',
      defaultValue: minimal_out_value,
      validate: basicValidate().greaterThan('burn_fee', 'error.above-out-fee'),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'create-fee',
      name: 'wallet_fee',
      unit: symbol,
      defaultValue: wallet_fee,
      validate: basicValidate(),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'morgage-amount',
      name: 'mortgage_amount',
      unit: 'cETH',
      defaultValue: defaultMortgageBig + '',
      validate: showMortgage
        ? basicValidate()
            .max(cethBalanceBig, 'error.insufficient')
            .min(defaultMortgageBig, 'error.above-current')
        : false,
      decimals: 18,
      readOnly: false,
    },
  ]
}
