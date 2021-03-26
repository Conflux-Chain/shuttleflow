import { useRef } from 'react'
import useState1 from '../lib/useState1'
import jsonrpc from './jsonrpc'
import { getTokenList } from './tokenList'
import useDeepCompareEffect from 'use-deep-compare-effect'
import formatNum from '../util/formatNum'
import useAddress from './useAddress'
import { useParams } from 'react-router'

export default function useOperationHistory({
  token,
  status,
  limit = 100,
  type,
} = {}) {
  const address = useAddress()
  const [state, setState] = useState1({ data: [], loading: true })
  const { chain } = useParams()
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
          chain,
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
  chain,
} = {}) {
  return Promise.all([
    getTokenList(chain).then(({ tokenMap }) => tokenMap),
    jsonrpc('getUserOperationList', {
      url: 'node',
      params: [
        {
          type,
          token,
          chain,
          status,
          address,
          defi: '0x0000000000000000000000000000000000000000',
        },
        0,
        limit,
      ],
    }),
  ]).then(([tokenMap, histories = []]) => {
    return histories
      .map(({ token, ...rest }) => {
        //todo make up for data error
        const { type: op_type } = rest
        if (!tokenMap[token] && op_type.split('_')[0] === 'cfx') {
          token = 'cfx'
        }
        //It can happen due to some unexpected human operation
        if (tokenMap[`${chain}-token`]) {
          return { ...rest, ...tokenMap[token], token, dir: type }
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
  dir,
  symbol,
  settled_tx,
  ...rest
}) {
  type = type.split('_')[1]
  const isOriginCfx =
    (dir === 'out' && type === 'mint') || (dir === 'in' && type === 'burn')
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
    symbol: isOriginCfx ? symbol : reference_symbol || reference,
    type,
    step,
    isOriginCfx,
    settled_tx,
    nonce_or_txid,
    dir,
    amount: (dir === 'in' ? '+' : '-') + formatNum(amount, decimals),
  }
}
