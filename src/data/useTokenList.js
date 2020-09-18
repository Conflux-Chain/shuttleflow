import useSWR, { mutate } from 'swr'
const TOKENS = [
    {
        symbol: 'BTC',
        cSymbol: 'cBTC',
        name: 'Bitcoin',
        cName: 'Conflux Bitcoin',
        mortgage: 1
    },
    {
        symbol: 'ETC',
        cSymbol: 'cETC',
        name: 'Ethereum',
        cName: 'Conflux Ethereum',
        mortgage: 2
    },
    {
        symbol: 'USDT',
        cSymbol: 'cUSDT',
        name: 'Tether USD',
        cName: 'Conflux Tether USD',
        erc20: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        mortgage: 3
    },
    {
        symbol: 'DAI',
        cSymbol: 'cDAI',
        name: 'DAI',
        cName: 'Conflux DAI',
        erc20: '0x6b175474e89094c44da98b954eedeac495271d0f',
        mortgage: 5
    },
]

const NOT_AVAILABLE = [
    {
        symbol: 'USDC',
        cSymbol: 'cUSDC',
        name: 'USD Coin',
        cName: 'Conflux USD Coin',
        erc20: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
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
                const existTk = TOKENS.find(tk => tk.erc20 === address)
                const noExist = NOT_AVAILABLE.find(tk => tk.erc20 === address)
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