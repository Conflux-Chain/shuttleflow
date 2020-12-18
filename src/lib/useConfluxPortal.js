import { useConfluxPortal } from '@cfxjs/react-hooks'
const { openHomePage } = useConfluxPortal
export default function useConfluxPortal1(...args) {
  const { login: _login, ...rest } = useConfluxPortal(...args)
  const { portalInstalled } = rest
  const login = () => {
    _login()
    if (portalInstalled) {
    } else {
      openHomePage()
    }
  }
  return { login, ...rest }
}
