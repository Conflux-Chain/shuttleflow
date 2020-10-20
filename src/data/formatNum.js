import { Big } from 'big.js'
export default function formatNum(value, decimal) {
  const v = new Big(value)
  const d = new Big(`1e${decimal}`)
  return parseFloat(v.div(d).toFixed(6))
}
