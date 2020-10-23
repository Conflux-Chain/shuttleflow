import { useConfluxPortal } from '@cfxjs/react-hooks'
export default function useClick(cb) {
  const { address } = useConfluxPortal()
  return function () {
    if (address) {
      cb.apply(null, arguments)
    } else {
      alert('longin')
    }
  }
}
