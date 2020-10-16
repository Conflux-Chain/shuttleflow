export default function formatAddress(txt) {
  if (!txt) {
    return ''
  }
  const first6 = txt.slice(0, 6)
  const last4 = txt.slice(txt.length - 4)
  return first6 + '...' + last4
}
