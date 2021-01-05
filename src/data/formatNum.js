import { Big } from 'big.js'

//the returned value can be inaccurate, for display purpose only
export default function formatNum(value, decimal) {
  return value ? parseFloat(parseNum(value, decimal).toFixed(6)) : ''
}

export function parseNum(value, decimal) {
  return Big(value).div(Big(`1e${decimal}`))
}

export function buildNum(value, decimal) {
  return Big(value)
    .mul(Big(`1e${decimal}`))
    .toString()
}
