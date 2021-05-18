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
  gasBalance,
  minimal_sponsor_amount,
  t,
  isMe,
  isMortgageLow,
  isLocking,
  mainPairSymbol,
  origin,
  to_chain,
}) {
  const isObverseIn =
    ['eth', 'bsc', 'oec'].indexOf(origin) !== -1 && to_chain === 'cfx'
  const isReverseIn =
    ['eth', 'bsc', 'oec'].indexOf(to_chain) !== -1 && origin === 'cfx'
  function createField({
    name,
    label,
    unit,
    currentValue,
    greaterThan,
    readOnly,
    showDefaultValue,
  }) {
    let validate = basicValidate()
    let errOrPlaceholder

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

    if (greaterThan) {
      const { ref, msg } = greaterThan
      validate = validate.greaterThan(ref, msg)
    }
    return {
      name,
      label,
      unit,
      decimals,
      defaultValue: showDefaultValue ? 0 : isMe ? currentValue : undefined,
      placeholder: isMortgageLow ? t('enter') : errOrPlaceholder,
      validate,
      readOnly,
    }
  }

  return [
    {
      name: 'mint_fee',
      label: 'shuttle-in-fee',
      unit: symbol,
      currentValue: in_fee,
      readOnly: isObverseIn || isReverseIn,
      showDefaultValue: isObverseIn || isReverseIn,
    },
    {
      label: 'shuttle-in-amount',
      name: 'minimal_mint_value',
      unit: reference_symbol,
      currentValue: minimal_in_value,
      greaterThan: { ref: 'mint_fee', msg: 'error.above-in-fee' },
      readOnly: isObverseIn,
      showDefaultValue: isObverseIn,
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
      readOnly: isObverseIn,
      showDefaultValue: isObverseIn,
    },
  ]
    .map(createField)
    .concat({
      label: 'mortgage-amount',
      name: 'mortgage_amount',
      unit: mainPairSymbol,
      validate: showMortgage
        ? basicValidate()
            .min(minimal_sponsor_amount, 'error.above-current')
            .max(gasBalance, 'error.insufficient')
        : false,
      decimals: 18,
      placeholder: t('enter'),
    })
}
