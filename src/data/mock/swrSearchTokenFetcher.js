import { TOKENS, NOT_AVAILABLE } from './listDB'


export default function swrSearchTokenFetcher(url, address, type = 'token') {
    return new Promise((resolve) => {
        console.log('address',address)
        const filter = ({ address: _address, cAddress }) => {
            if (type === 'token') {
                return address === _address
            } else if (type === 'both') {
                return [_address, cAddress].indexOf(address) > -1
            }
        }
        let result
        const found = ([...TOKENS, ...NOT_AVAILABLE])
            .filter(filter)

        console.log(found)
        if (found) {
            result = found[0]
        }
        setTimeout(() => {
            resolve(result)
        }, 3000)


    })



}