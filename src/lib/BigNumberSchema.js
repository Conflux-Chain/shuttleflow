import BaseSchema from 'yup/es/mixed'
import Big from 'big.js'

export function create() {
  return new BigSchema()
}

export default class BigSchema extends BaseSchema {
  constructor() {
    super({ type: 'bigNumber' })
    this.withMutation(() => {
      this.transform(function (value) {
        if (typeof value === 'string') {
          try {
            value = new Big(value)
          } catch (e) {
            //indicating a type error
            value = 'type error'
          }
        }
        return value
      })
    })
  }
  _typeCheck(value) {
    console.log('value', value + '')
    return value !== 'type error'
  }
  aboveZero(message) {
    return this.test({
      message,
      name: 'zero',
      exclusive: true,
      test(value) {
        return value.gte('0')
      },
    })
  }

  greaterThan(key, message) {
    return this.test({
      message,
      name: 'greater',
      exclusive: true,
      test(params) {
        const {
          parent: { [key]: value },
        } = this
        if (params && value) {
          return params.gt(value)
        } else {
          return true
        }
      },
    })
  }
}
create.prototype = BigSchema.prototype
