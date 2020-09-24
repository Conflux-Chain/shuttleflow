import useSWR, { mutate } from 'swr'
import icon from './icon.png'
const TOKENS = [
    {
        symbol: 'BTC',
        cSymbol: 'cBTC',
        icon,
        name: 'Bitcoin',
        cName: 'Conflux Bitcoin',
        mortgage: 1
    },
    {
        symbol: 'ETC',
        cSymbol: 'cETC',
        icon,
        name: 'Ethereum',
        cName: 'Conflux Ethereum',
        mortgage: 2
    },
    {
        symbol: 'USDT',
        cSymbol: 'cUSDT',
        icon,
        name: 'Tether USD',
        cName: 'Conflux Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        mortgage: 3
    },
    {
        symbol: 'DAI',
        cSymbol: 'cDAI',
        icon,
        name: 'DAI',
        cName: 'Conflux DAI',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        mortgage: 5
    },
    {
        symbol: 'BTC1',
        cSymbol: 'cBTC',
        icon,
        name: 'Bitcoin',
        cName: 'Conflux Bitcoin',
        mortgage: 1
    },
    {
        symbol: 'ETC1',
        cSymbol: 'cETC',
        icon,
        name: 'Ethereum',
        cName: 'Conflux Ethereum',
        mortgage: 2
    },
    {
        symbol: 'USDT1',
        cSymbol: 'cUSDT',
        icon,
        name: 'Tether USD',
        cName: 'Conflux Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        mortgage: 3
    },
    {
        symbol: 'DAI1',
        cSymbol: 'cDAI',
        icon,
        name: 'DAI',
        cName: 'Conflux DAI',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        mortgage: 5
    },
    {
        symbol: 'BTC2',
        cSymbol: 'cBTC',
        icon,
        name: 'Bitcoin',
        cName: 'Conflux Bitcoin',
        mortgage: 1
    },
    {
        symbol: 'ETC2',
        cSymbol: 'cETC',
        icon,
        name: 'Ethereum',
        cName: 'Conflux Ethereum',
        mortgage: 2
    },
    {
        symbol: 'USDT2',
        cSymbol: 'cUSDT',
        icon,
        name: 'Tether USD',
        cName: 'Conflux Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        mortgage: 3
    },
    {
        symbol: 'DAI2',
        cSymbol: 'cDAI',
        icon,
        name: 'DAI',
        cName: 'Conflux DAI',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        mortgage: 5
    },
    {
        symbol: 'BTC3',
        cSymbol: 'cBTC',
        icon,
        name: 'Bitcoin',
        cName: 'Conflux Bitcoin',
        mortgage: 1
    },
    {
        symbol: 'ETC3',
        cSymbol: 'cETC',
        icon,
        name: 'Ethereum',
        cName: 'Conflux Ethereum',
        mortgage: 2
    },
    {
        symbol: 'USDT3',
        cSymbol: 'cUSDT',
        icon,
        name: 'Tether USD',
        cName: 'Conflux Tether USD',
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        mortgage: 3
    },
    {
        symbol: 'DAI3',
        cSymbol: 'cDAI',
        icon,
        name: 'DAI',
        cName: 'Conflux DAI',
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        mortgage: 5
    },
]

const NOT_AVAILABLE = [
    {
        symbol: 'USDC',
        cSymbol: 'cUSDC',
        icon,
        name: 'USD Coin',
        cName: 'Conflux USD Coin',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    }
]
//
export default function useTokenList(searchKey) {
    let txt, address
    if (isName(searchKey)) {
        txt = searchKey
    } else {
        address = searchKey
    }

    let { data, error } = useSWR(['/tokenList', address], fetchTokenList, { suspense: true })

    if (txt) {
        data = data.filter(({ name, symbol }) => {
            return name.toLowerCase().indexOf(txt) > -1 ||
                symbol.toLowerCase().indexOf(txt) > -1
        })
    }
    return {
        tokenList: data,
        error: error
    }
}

function fetchTokenList(url, address) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let tks;
            if (address) {
                const existTk = TOKENS.find(tk => tk.address === address)
                const noExist = NOT_AVAILABLE.find(tk => tk.address === address)
                if (noExist) {
                    noExist['notAvailable'] = true
                }
                tks = [existTk || noExist].filter(x => x)
            }
            resolve(tks ? tks : TOKENS)
        }, 1000);
    })
}

function isName(search) {
    return !search.startsWith('0x')
}