import { useEffect, useState } from 'react'
import { breakPoint } from '../config/size'

function scaleLinear(domain, range) {
  const [d1, d2] = domain
  const [r1, r2] = range
  return function (v) {
    return r1 + ((r2 - r1) * (v - d1)) / (d2 - d1)
  }
}

const s1 = scaleLinear([375, breakPoint], [8, 8])
const s2 = scaleLinear([breakPoint, 1920], [12, 16])

function setRem() {
  const width = window.innerWidth
  const s = width <= breakPoint ? s1 : s2

  // const
  const fontSize = s(width)
  document.documentElement.style.fontSize = fontSize + 'px'
}

setRem()

window.onresize = setRem

const mediaQuery = window.matchMedia(`(max-width: ${breakPoint}px)`)

export default function useIsSamll() {
  const [isSmall, setIsSmall] = useState(mediaQuery.matches)
  useEffect(() => {
    const listener = (e) => setIsSmall(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])
  return isSmall
}
