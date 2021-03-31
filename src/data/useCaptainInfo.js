import { getContract } from './contract/contract'
import Big from 'big.js'
import useSWR from 'swr'
import { useParams } from 'react-router'



export function useCustodianInfo(tokenInfo) {
  const { chain } = useParams()
  return useSWR(
    tokenInfo ? ['captain1', chain, tokenInfo.origin] : null,
    fetcher1,
    {
      suspense: true,
    }
  ).data
}

function fetcher1(key, chain, origin) {
  let toCfxOrFromCfx
  if (origin === 'cfx') {
    toCfxOrFromCfx = 'fromCfx'
  } else {
    toCfxOrFromCfx = 'toCfx'
  }

  return getContract(`custodian.${toCfxOrFromCfx}.${chain}`)
    .then((c) => {
      return Promise.all(
        [
          c.minimal_sponsor_amount(),
          c.default_cooldown(),
          c.safe_sponsor_amount(),
        ].map((fn) => fn.call())
      )
    })
    .then(([...custodianData]) => {
      const [
        minimal_sponsor_amount,
        default_cooldown,
        safe_sponsor_amount,
      ] = custodianData.map((x) => Big(x + ''))

      return {
        default_cooldown,
        minimal_sponsor_amount: minimal_sponsor_amount.div('1e18'),
        safe_sponsor_amount: safe_sponsor_amount.div('1e18'),
      }
    })
}
