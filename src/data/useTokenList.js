import useSWR from 'swr'
import { TOKENS, NOT_AVAILABLE } from './listDB'


//the hook both frontend search and backend search
export default function useTokenList(search = '') {
  let txt, address
  // return no result
  if (search !== null) {
    if (isName(search)) {
      txt = search
    } else {
      address = search
    }
  }

  console.log('searchKey', search)

  let { data, error } = useSWR(
    search === null ? false : ['/tokenList', address],
    fetchTokenList,
    // {
    //   suspense: true,
    // }
  )

  if (txt) {
    data = data.filter(({ name, symbol }) => {
      return (
        name.toLowerCase().indexOf(txt) > -1 ||
        symbol.toLowerCase().indexOf(txt) > -1
      )
    })
  }
  return {
    tokenList: data.filter(({ name, symbol }) => {
      return (
        name.toLowerCase().indexOf(txt) > -1 ||
        symbol.toLowerCase().indexOf(txt) > -1
      )
    }),
    error: error,
  }
}

export function fetchTokenList(url, address) {
  console.log('fetch', url, address)
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
    }, 3000)
  })
}

function isName(search) {
  return !search.startsWith('0x') && ['btc', 'eth'].indexOf(search) === -1
}
