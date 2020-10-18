import { useEffect, useRef } from 'react'
import useState1 from './useState1'
import histories from './mock'
import jsonrpc from './jsonrpc'

export default function useHistory({ token, status } = {}) {
  const [state, setState] = useState1({ data: [], loading: false })
  const reload = useRef(null)
  useEffect(() => {
    let _reload
    if (token || status) {
      _reload = () => {
        setState({ loading: true })
        setTimeout(() => {
          setState(histories)
        }, 1000)
      }
    } else {
      _reload = () => {
        setTimeout(() => {
          setState(histories)
        }, 1000)
      }
    }
    _reload()
    reload.current = reload
  }, [token, status, setState])

  //   const reload = () => {}
  return { data: state.data, loading: state.loading, reload: reload.current }
}

jsonrpc('getSpecificUserOperationList',{url:'node',})
