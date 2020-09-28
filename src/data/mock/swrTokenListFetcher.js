import { TOKENS } from './listDB'
export default function swrTokenListFetcher() {
    return new Promise((resolve) => {
        resolve(TOKENS.map(({ symbol, cSymbol, icon, name, cName,
            address, cAddress, minMortgage }) =>
            ({
                symbol, cSymbol, icon, name, cName,
                address, cAddress, minMortgage
            })))
    })
}