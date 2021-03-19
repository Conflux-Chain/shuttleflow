// yup@v0.32.8
import BaseSchema from 'yup/es/mixed'
import Big from 'big.js'

const TYPE_ERROR = 'TYPE_ERROR'
export default class BigSchema extends BaseSchema {
  constructor() {
    super({ type: 'bigNumber' })
    this.withMutation(() => {
      this.transform(function (value) {
        if (typeof value === 'string') {
          try {
            value = new Big(value)
          } catch (e) {
            value = TYPE_ERROR
          }
        }
        return value
      })
    })
  }
  _typeCheck(value) {
    return value !== TYPE_ERROR
  }
  aboveZero(message) {
    return this.test({
      message,
      name: 'zero',
      exclusive: true,
      test(value) {
        return value instanceof Big ? value.gte('0') : true
      },
    })
  }

  isZero(message) {
    return this.test({
      message,
      name: 'is-zero',
      exclusive: true,
      test(value) {
        return value instanceof Big ? value.eq('0') : true
      },
    })
  }

  greaterThan(key, message) {
    console.log('greaterThan register')
    return this.test({
      message,
      name: 'greaterThan',
      exclusive: true,
      test(params) {
        console.log('trigger test')
        const {
          parent: { [key]: value },
        } = this

        //values in parent can not be typechecked properly
        //TODO: read source code and provide PR?
        if (params && value && params instanceof Big && value instanceof Big) {
          console.log('====', params + '', value + '')
          return params.gte(value)
        } else {
          return true
        }
      },
    })
  }
  max(value, message) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      test(params) {
        return params.lte(value)
      },
    })
  }
  lessThan(value, message) {
    return this.test({
      message,
      name: 'lessThan',
      exclusive: true,
      test(params) {
        return params.lt(value)
      },
    })
  }
  min(value, message) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      test(params) {
        return params.gte(value)
      },
    })
  }
}

export const big = () => {
  return new BigSchema().typeError('error.number').aboveZero('error.above-zero')
}
