import { Big } from 'big.js'

//the returned value can be inaccurate, for display purpose only
export default function formatNum(value, decimal) {
  return value ? parseFloat(parseNum(value, decimal).toFixed(6)) : ''
}

export function parseNum(value, decimal) {
  return Big(value).div(Big(`1e${decimal}`))

  // let i = parseInt(decimal)
  // value += ''
  // if (value.indexOf('.') > -1) {
  //   throw new Error('Integer only')
  // }
  // //remove trailing zeros
  // while (i-- > 0) {
  //   if (value[value.length - 1] === '0') {
  //     value = value.slice(0, value.length - 1)
  //   } else {
  //     break
  //   }
  // }
  // if (i === -1) {
  //   return value
  // } else {
  //   const l = value.length
  //   let d = l - i
  //   if (d > 0) {
  //     return (value.slice(0, d - 1) || '0') + '.' + value.slice(d - 1)
  //   } else {
  //     let padding = ''
  //     while (d++ <= 0) {
  //       padding += '0'
  //     }
  //     return '0.' + padding + value
  //   }
  // }
}
