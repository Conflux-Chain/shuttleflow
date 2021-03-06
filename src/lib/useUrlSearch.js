import { useLocation } from 'react-router-dom'
export default function useUrlSearch() {
  const { search } = useLocation()
  return parseSearch(search)
}

function parseSearch(search) {
  return [...new URLSearchParams(search).entries()].reduce(
    (pre, [key, value]) => {
      pre[key] = value
      return pre
    },
    {}
  )
}
