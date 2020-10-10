import { TOKENS } from './listDB'
export default function swrTokenListFetcher() {
    console.log('http request /tokenList')
    return new Promise((resolve) => {
        resolve(TOKENS.map(({ symbol, cSymbol, icon, name, cName,
            address, cAddress, minMortgage, supply }) =>
            ({
                symbol, cSymbol, icon, name, cName,
                address, cAddress, minMortgage, supply
            })))
    })
}