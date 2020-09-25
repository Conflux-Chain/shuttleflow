import useSWR from 'swr'
import icon from './icon.png'
const TOKENS = [
  {
    symbol: 'BTC',
    cSymbol: 'cBTC',
    icon: 'https://via.placeholder.com/50',
    name: 'Bitcoin',
    cName: 'Conflux Bitcoin',
    address: 'btc',
    cAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    minMortgage: 10,
  },
  {
    symbol: 'ETC',
    cSymbol: 'cETC',
    icon: 'https://via.placeholder.com/50',
    name: 'Ethereum',
    cName: 'Conflux Ethereum',
    address: 'eth',
    cAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    minMortgage: 10,
    inFee: 0.2,
    outFee: 0.3,
    minIn: 3,
    minOut: 4,
  },
  {
    symbol: 'USDT',
    cSymbol: 'cUSDT',
    icon: 'https://via.placeholder.com/50',
    name: 'Tether USD',
    cName: 'Conflux Tether USD',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    cAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    minMortgage: 10,
    inFee: 0.2,
    outFee: 0.3,
    minIn: 3,
    minOut: 4,
  },
  {
    symbol: 'DAI',
    cSymbol: 'cDAI',
    icon: 'https://via.placeholder.com/50',
    name: 'DAI',
    cName: 'Conflux DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    cAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    minMortgage: 10,
    inFee: 0.2,
    outFee: 0.3,
    minIn: 3,
    minOut: 4,
  },
]

const NOT_AVAILABLE = [
  {
    symbol: 'USDC',
    cSymbol: 'cUSDC',
    icon,
    name: 'USD Coin',
    cName: 'Conflux USD Coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
]
//
export default function useTokenList(searchKey) {
  let txt, address
  if (isName(searchKey)) {
    txt = searchKey
  } else {
    address = searchKey
  }

  let { data, error } = useSWR(['/tokenList', address], fetchTokenList, {
    suspense: true,
  })

  if (txt) {
    data = data.filter(({ name, symbol }) => {
      return (
        name.toLowerCase().indexOf(txt) > -1 ||
        symbol.toLowerCase().indexOf(txt) > -1
      )
    })
  }
  return {
    tokenList: data,
    error: error,
  }
}

function fetchTokenList(url, address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let tks
      if (address) {
        const existTk = TOKENS.find((tk) => tk.address === address)
        const noExist = NOT_AVAILABLE.find((tk) => tk.address === address)
        if (noExist) {
          noExist['notAvailable'] = true
        }
        tks = [existTk || noExist].filter((x) => x)
      }
      resolve(tks ? tks : TOKENS)
    }, 1000)
  })
}

function isName(search) {
  return !search.startsWith('0x')
}
