import { useEffect, useState } from 'react'

const mediaQuery = window.matchMedia('(max-width: 900px)')

export default function useIsSamll() {
  const [isSmall, setIsSmall] = useState(mediaQuery.matches)
  useEffect(() => {
    const listener = (e) => setIsSmall(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  return isSmall
}
