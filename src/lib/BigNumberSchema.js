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
            console.log(e)
            // value = new Big('-1')
            value = 'type error'
          }
        }
        return value
      })
    })
  }
  _typeCheck(value) {
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

        //values in parent can not be typechecked properly
        //TODO: read source code and provide PR?
        if (params && value && params instanceof Big && value instanceof Big) {
          return params.gt(value)
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
create.prototype = BigSchema.prototype
