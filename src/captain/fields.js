import { big } from '../lib/yup/BigNumberSchema'

const basicValidate = () => {
  return big().typeError('error.number').aboveZero('error.above-zero')
}

export default function getFields({
  reference_symbol,
  mint_fee,
  burn_fee,
  countdown,
  decimals,
  minimal_burn_value,
  minimal_mint_value,
  wallet_fee,
  showMortgage,
  cethBalanceBig,
  defaultMortgageBig,
}) {
  return [
    {
      name: 'mint_fee',
      label: 'shuttle-in-fee',
      unit: reference_symbol,
      decimals,
      validate: basicValidate(),
      defaultValue: mint_fee,
      readOnly: countdown !== 0,
    },
    {
      label: 'shuttle-in-amount',
      unit: reference_symbol,
      name: 'minimal_mint_value',
      defaultValue: minimal_mint_value,
      validate: basicValidate().greaterThan('mint_fee', 'error.above-in-fee'),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'shuttle-out-fee',
      unit: reference_symbol,
      name: 'burn_fee',
      defaultValue: burn_fee,
      validate: basicValidate(),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'shuttle-out-amount',
      unit: reference_symbol,
      name: 'minimal_burn_value',
      defaultValue: minimal_burn_value,
      validate: basicValidate().greaterThan('burn_fee', 'error.above-out-fee'),
      decimals,
      readOnly: countdown !== 0,
    },
    {
      label: 'create-fee',
      name: 'wallet_fee',
      unit: reference_symbol,
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
