import { big } from '../lib/yup/BigNumberSchema'

const basicValidate = () => {
  return big()
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
  minMortgageBig,
  t,
  isMe,
  isMortgageLow,
}) {
  function createField({ name, label, unit, currentValue, greaterThan }) {
    let validate = basicValidate().lessThan(
      currentValue,
      t('error.less-than', { value: currentValue })
    )
    if (greaterThan) {
      const { ref, msg } = greaterThan
      validate = validate.greaterThan(ref, msg)
    }
    return {
      name,
      label,
      unit,
      decimals,
      defaultValue: isMe ? currentValue : undefined,
      placeholder: isMortgageLow
        ? t('enter')
        : t('error.less-than', { value: currentValue }),
      validate,
    }
  }

  return [
    {
      name: 'mint_fee',
      label: 'shuttle-in-fee',
      unit: symbol,
      currentValue: in_fee,
    },
    {
      label: 'shuttle-in-amount',
      name: 'minimal_mint_value',
      unit: reference_symbol,
      currentValue: minimal_in_value,
      greaterThan: { ref: 'mint_fee', msg: 'error.above-in-fee' },
    },
    {
      name: 'burn_fee',
      label: 'shuttle-out-fee',
      unit: symbol,
      currentValue: out_fee,
    },
    {
      name: 'minimal_burn_value',
      label: 'shuttle-out-amount',
      unit: symbol,
      currentValue: minimal_in_value,
      greaterThan: { ref: 'burn_fee', msg: 'error.above-out-fee' },
    },

    {
      name: 'wallet_fee',
      label: 'create-fee',
      unit: symbol,
      currentValue: wallet_fee,
    },
  ]
    .map(createField)
    .concat({
      label: 'morgage-amount',
      name: 'mortgage_amount',
      unit: 'cETH',
      validate: showMortgage
        ? basicValidate()
            .min(minMortgageBig, 'error.above-current')
            .max(cethBalanceBig, 'error.insufficient')
        : false,
      decimals: 18,
      readOnly: false,
    })
  return [
    // createField()
    {
      name: 'mint_fee',
      label: 'shuttle-in-fee',
      unit: symbol,
      decimals,
      defaultValue: isMe ? in_fee : undefined,
      placeholder: isMortgageLow
        ? t('enter')
        : t('error.less-than', { value: in_fee }),
      validate: basicValidate().lessThan(
        in_fee,
        t('error.less-than', { value: in_fee })
      ),
      // defaultValue: in_fee,
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
      validate: showMortgage
        ? basicValidate()
            .min(minMortgageBig, 'error.above-current')
            .max(cethBalanceBig, 'error.insufficient')
        : false,
      decimals: 18,
      readOnly: false,
    },
  ]
}
