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
  decimals,
  wallet_fee,
  showMortgage,
  cethBalanceBig,
  minMortgageBig,
  t,
  isMe,
  isMortgageLow,
  isLoacking: isLocking,
}) {
  function createField({ name, label, unit, currentValue, greaterThan }) {
    let validate = basicValidate()
    let errOrPlaceholder

    console.log('currentValue', currentValue > 0)
    if (isMortgageLow) {
    } else {
      if (isMe) {
        if (isLocking) {
          if (currentValue.eq('0')) {
            errOrPlaceholder = t('need-zero', { value: currentValue })
            validate = validate.isZero(errOrPlaceholder)
          } else {
            errOrPlaceholder = t('error.less-than-eq', { value: currentValue })
            validate = validate.lessThanEq(currentValue, errOrPlaceholder)
          }
        }
      } else {
        if (currentValue.eq('0')) {
          errOrPlaceholder = t('need-zero', { value: currentValue })
          validate = validate.isZero(errOrPlaceholder)
        } else {
          errOrPlaceholder = t('error.less-than', { value: currentValue })
          validate = validate.lessThan(currentValue, errOrPlaceholder)
        }
      }
    }

    // if (!isMortgageLow || (isMe && isLocking)) {
    //   if (currentValue === 0) {
    //     errOrPlaceholder = t('is-zero', { value: currentValue })
    //     validate = validate.isZero(errOrPlaceholder)
    //   } else if (currentValue > 0) {
    //     errOrPlaceholder = t('error.less-than', { value: currentValue })
    //     validate = validate.lessThan(currentValue, errOrPlaceholder)
    //   }
    // }
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
      placeholder: isMortgageLow ? t('enter') : errOrPlaceholder,
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
      currentValue: minimal_out_value,
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
      placeholder: t('enter'),
    })
}
