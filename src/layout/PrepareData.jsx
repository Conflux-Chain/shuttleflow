import wrapPromise from '../lib/wrapPromise'
const waitFont = wrapPromise(document?.fonts?.ready || Promise.resolve())
export default function PrepareData({ children }) {
  const result = waitFont()
  return children
}
