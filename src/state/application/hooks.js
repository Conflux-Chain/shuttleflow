import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'

export function useBlockNumber() {
  const { chainId } = useActiveWeb3React()

  return useSelector((state) => state.application.blockNumber[chainId ?? -1])
}

// returns a function that allows adding a popup
export function useAddPopup() {
  const dispatch = useDispatch()

  return useCallback(
    (content, key) => {
      dispatch(addPopup({ content, key }))
    },
    [dispatch]
  )
}

// returns a function that allows removing a popup via its key
export function useRemovePopup() {
  const dispatch = useDispatch()
  return useCallback(
    (key) => {
      dispatch(removePopup({ key }))
    },
    [dispatch]
  )
}

// get the list of active popups
export function useActivePopups() {
  const list = useSelector((state) => state.application.popupList)
  return useMemo(() => list.filter(item => item.show), [list])
}


