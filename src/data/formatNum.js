export default function formatNum(value, decimal) {
  return parseFloat((parseFloat(value) / Math.pow(10, decimal)).toFixed(6))
}
