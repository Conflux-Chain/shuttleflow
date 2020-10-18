const histories = [
  {
    token: '0x6b175474e89094c44da98b954eedeac495271d0f',
    type: 'cETH_mint',
    nonce_or_txid:
      '0xf5fd4b2936d18395c4c6c1f282cef725c22770edf79029bbda97ee8d623222c2',
    amount: '490000000000000000',
    user_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    defi: '0x0000000000000000000000000000000000000000',
    to_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    status: 'finished',
    settled_tx:
      '0xb706503e8bdbc0fba10040aa59fda3d0c7732967fc08591ff03df6102cbb1b6c',
  },
  {
    token: '0x6b175474e89094c44da98b954eedeac495271d0f',
    type: 'cETH_mint',
    nonce_or_txid:
      '0xf5fd4b2936d18395c4c6c1f282cef725c22770edf79029bbda97ee8d623222c2',
    amount: '490000000000000000',
    user_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    defi: '0x0000000000000000000000000000000000000000',
    to_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    status: 'doing',
    settled_tx:
      '0xb706503e8bdbc0fba10040aa59fda3d0c7732967fc08591ff03df6102cbb1b6c',
  },
  {
    token: '0x6b175474e89094c44da98b954eedeac495271d0f',
    type: 'cETH_mint',
    nonce_or_txid:
      '0xf5fd4b2936d18395c4c6c1f282cef725c22770edf79029bbda97ee8d623222c2',
    amount: '490000000000000000',
    user_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    defi: '0x0000000000000000000000000000000000000000',
    to_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    status: 'confirming',
    settled_tx:
      '0xb706503e8bdbc0fba10040aa59fda3d0c7732967fc08591ff03df6102cbb1b6c',
  },
  {
    token: '0x6b175474e89094c44da98b954eedeac495271d0f',
    type: 'cETH_mint',
    nonce_or_txid:
      '0xf5fd4b2936d18395c4c6c1f282cef725c22770edf79029bbda97ee8d623222c2',
    amount: '490000000000000000',
    user_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    defi: '0x0000000000000000000000000000000000000000',
    to_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    status: 'finished',
    settled_tx:
      '0xb706503e8bdbc0fba10040aa59fda3d0c7732967fc08591ff03df6102cbb1b6c',
  },
  {
    token: '0x6b175474e89094c44da98b954eedeac495271d0f',
    type: 'cETH_mint',
    nonce_or_txid:
      '0xf5fd4b2936d18395c4c6c1f282cef725c22770edf79029bbda97ee8d623222c2',
    amount: '490000000000000000',
    user_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    defi: '0x0000000000000000000000000000000000000000',
    to_addr: '0x135d73d6ce217f8fe255f98e1589158972d8adc3',
    status: 'finished',
    settled_tx:
      '0xb706503e8bdbc0fba10040aa59fda3d0c7732967fc08591ff03df6102cbb1b6c',
  },
]

const historyAdapter = ({
  token,
  type,
  nonce_or_txid,
  amount,
  user_addr,
  defi,
  to_addr,
  status,
  settled_tx,
}) => {
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
    token,
    type,
    step,
    settled_tx,
    nonce_or_txid,
    amount,
    icon: 'https://via.placeholder.com/50',
  }
}
export default histories.map(historyAdapter)
