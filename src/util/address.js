export function isAddress(value = '') {
  return /^0x[0-9a-fA-F]{40}$/.test(value)
}
