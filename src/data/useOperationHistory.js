import { useRef } from 'react'
import useState1 from './useState1'
import jsonrpc from './jsonrpc'
import { tokenMap as tokeMapPms } from './tokenList'
import useDeepCompareEffect from 'use-deep-compare-effect'
import formatNum from '../util/formatNum'
import useAddress from './useAddress'

export default function useHistory({ token, status, limit = 100, type } = {}) {
  const address = useAddress()
  const [state, setState] = useState1({ data: [], loading: true })
  const reload = useRef(null)
  useDeepCompareEffect(() => {
    let mount = true
    if (address) {
      //portal is not connected
      const getFetchHistory = () =>
        fetchHistory({
          status,
          limit,
          type,
          address,
        })
      const _reload = () => {
        setState({ loading: true })
        return getFetchHistory().then((data) => {
          if (mount) {
            setState({ data, loading: false })
          }
        })
      }
      reload.current = () => {
        setState({ loading: true })
        Promise.all([
          new Promise((resolve) => {
            setTimeout(() => {
              resolve()
            }, 3000)
          }),
          getFetchHistory(),
        ]).then(([_, data]) => {
          if (mount) {
            setState({ data, loading: false })
          }
        })
      }
      _reload()
    }
    return () => {
      mount = false
    }
  }, [token, status, type, setState, address])

  //   const reload = () => {}
  return { data: state.data, loading: state.loading, reload: reload.current }
}

// "type": "mint" | "burn"
// "token": "btc" | "eth" | lowercase erc20 address
// "defi": conflux defi address (for shuttleflow frontend, hard code zero address)
// "address": user conflux address
// "status": ["doing", "comfirming","finished"]
function fetchHistory({
  type = null,
  token = null,
  limit,
  status = ['comfirming', 'doing', 'finished'],
  address,
} = {}) {
  return Promise.all([
    tokeMapPms,
    jsonrpc('getSpecificUserOperationList', {
      url: 'node',
      params: [
        {
          type,
          token,
          status,
          address,
          defi: '0x0000000000000000000000000000000000000000',
        },
        0,
        limit,
      ],
    }).then((x) => x.txs),
  ]).then(([tokenMap, histories]) => {
    return histories
      .map(({ token, ...rest }) => {
        //todo make up for data error
        if (!token) {
          token = 'btc'
        }
        //It can happen due to some unexpected human operation
        if (tokenMap[token]) {
          return { ...rest, ...tokenMap[token], token }
        } else {
          return false
        }
      })
      .filter((x) => x)
      .map(historyAdapter)
  })
}

function historyAdapter({
  reference,
  decimals,
  reference_symbol,
  type,
  nonce_or_txid,
  amount,
  status,
  settled_tx,
  ...rest
}) {
  type = type.split('_')[1]
  let step
  if (status === 'confirming') {
    step = 0
  } else if (status === 'doing') {
    if (!settled_tx) {
      step = 1
    } else {
      step = 2
    }
  } else if (status === 'finished') {
    step = 3
  }

  return {
    //btc and eth do not have symbol
    ...rest,
    symbol: reference_symbol || reference,
    type,
    step,
    settled_tx,
    nonce_or_txid,
    amount: (type === 'mint' ? '+' : '-') + formatNum(amount, decimals),
  }
}
