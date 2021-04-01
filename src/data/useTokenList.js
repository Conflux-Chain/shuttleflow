import { useParams } from 'react-router'
import CHAIN_CONFIG from '../config/chainConfig'

import { getTokenList } from './tokenList'
import useSWR from 'swr'
import { getIdFromToken, parseId } from '../util/id'
import jsonrpc from './jsonrpc'

import { updateTokenList } from './tokenList'
import { isCfxAddress, isZeroAddress } from '../util/address'
import { getContract } from './contract/contract'
import Big from 'big.js'
import { giveTransactionResult } from '../globalPopup/TranscationResult'
import { ZERO_ADDR } from '../config/config'

const MAX_DECIMAL_DISPLAY = 8
export function usePairInfo(pair) {
  const { selectedAddress } = window.conflux
  return useSWR(pair ? ['pair', pair, selectedAddress] : null, fetchPair, {
    suspense: true,
    revalidateOnMount: true,
  })
}

function fetchPair(key, pair, address) {
  const { origin, originAddr, nonCfxChain } = parseId(pair)
  return getTokenList(nonCfxChain)
    .then(({ tokenMap }) => {
      const pairFromServer = tokenMap[pair]
      const { mainPair, singleToken } = CHAIN_CONFIG[nonCfxChain]
      const mairTokenInfo = tokenMap[mainPair]

      function getTokenInfo() {
        if (pairFromServer) {
          return Promise.resolve({ ...pairFromServer, singleton: singleToken })
        } else {
          if (origin === nonCfxChain) {
            return CHAIN_CONFIG[nonCfxChain].searchTokenFromServer(originAddr)
          } else if (origin === 'cfx') {
            return searchCfxFromServer(originAddr, nonCfxChain)
          }
        }
      }

      return getTokenInfo().then((tokenInfo) => {
        return [tokenInfo, mairTokenInfo]
      })
    })
    .then(([token, mairPairInfo]) => {
      function readTokenFromContract({ reference, ctoken, decimals, origin }) {
        let toCfxOrFromCfx, referenceOrCtoken, _in, _out, direction
        if (origin === 'cfx') {
          toCfxOrFromCfx = 'fromCfx'
          referenceOrCtoken = ctoken
          direction = ['cfx', nonCfxChain]
          if (referenceOrCtoken === 'cfx') {
            referenceOrCtoken = ZERO_ADDR
          }
          _in = 'burn'
          _out = 'mint'
        } else {
          toCfxOrFromCfx = 'toCfx'
          referenceOrCtoken = reference
          direction = [nonCfxChain, 'cfx']
          _in = 'mint'
          _out = 'burn'
        }

        const { symbol: mainPairSymbol, ctoken: mainPairCtoken } = mairPairInfo
        return Promise.all([
          jsonrpc('getPendingOperationInfo', {
            url: 'node',
            params: [referenceOrCtoken, ...direction],
          }),
          getContract(`custodian.${toCfxOrFromCfx}.${nonCfxChain}`).then(
            (c) => {
              return Promise.all(
                [
                  c.burn_fee(referenceOrCtoken),
                  c.mint_fee(referenceOrCtoken),
                  c.wallet_fee(referenceOrCtoken),
                  referenceOrCtoken === 'btc'
                    ? c.btc_minimal_burn_value()
                    : c.minimal_mint_value(referenceOrCtoken),
                  referenceOrCtoken === 'btc'
                    ? c.btc_minimal_burn_value()
                    : c.minimal_burn_value(referenceOrCtoken),
                  c.token_cooldown(referenceOrCtoken),
                  c.minimal_sponsor_amount(),
                  c.default_cooldown(),
                  c.safe_sponsor_amount(),
                ].map((fn) => fn.call())
              )
            }
          ),
          getContract(`sponsor.${toCfxOrFromCfx}.${nonCfxChain}`).then((c) => {
            return Promise.all(
              [
                c.sponsorOf(referenceOrCtoken),
                c.sponsorValueOf(referenceOrCtoken),
              ].map((fn) => fn.call())
            )
          }),

          getContract('balance').then((c) => {
            return c.tokenBalance(address, mainPairCtoken).call()
          }),
        ]).then(([pendingInfo, custodianData, sponsorData, gasBalance]) => {
          const { cnt } = pendingInfo || { cnt: 0 }
          const [
            burn_fee,
            mint_fee,
            wallet_fee,
            minimal_mint_value,
            minimal_burn_value,
            token_cooldown,
            minimal_sponsor_amount,
            default_cooldown,
            safe_sponsor_amount,
          ] = custodianData.map((x) => Big(x + ''))

          const values = {
            burn_fee,
            mint_fee,
            wallet_fee,
            minimal_mint_value,
            minimal_burn_value,
          }

          const sponsor = sponsorData[0]
          const sponsorValue = Big(sponsorData[1] + '')
          // displayed in popup
          const default_cooldown_minutes = parseInt(default_cooldown) / 60

          const diff = parseInt(Date.now() / 1000 - parseInt(token_cooldown))

          gasBalance = Big(gasBalance + '').div('1e18')
          let gasBalanceDisplay = gasBalance.round(MAX_DECIMAL_DISPLAY, 0)
          if (!gasBalanceDisplay.eq(gasBalance)) {
            gasBalanceDisplay += '...'
          }

          return {
            pendingCount: cnt,
            out_fee: values[`${_out}_fee`].div(`1e${decimals}`),
            in_fee: values[`${_in}_fee`].div(`1e${decimals}`),
            wallet_fee: wallet_fee.div(`1e${decimals}`),
            minimal_in_value: values[`minimal_${_in}_value`].div(
              `1e${decimals}`
            ),
            minimal_out_value: values[`minimal_${_out}_value`].div(
              `1e${decimals}`
            ),
            minimal_sponsor_amount: minimal_sponsor_amount.div('1e18'),
            default_cooldown_minutes,
            countdown: Math.max(0, parseInt(default_cooldown + '') - diff),
            sponsor,
            gasBalance,
            sponsorValue: sponsorValue.div('1e18'),
            safe_sponsor_amount: safe_sponsor_amount.div('1e18'),
            mainPairSymbol,
            gasBalanceDisplay,
            supported: !isZeroAddress(sponsor),
            beCaptain: ({
              amount,
              burnFee,
              mintFee,
              walletFee,
              minimalMintValue,
              minimalBurnValue,
              cb,
            }) => {
              amount = amount && amount.mul('1e18')
              burnFee = burnFee.mul(`1e${decimals}`)
              mintFee = mintFee.mul(`1e${decimals}`)
              walletFee = walletFee.mul(`1e${decimals}`)
              minimalMintValue = minimalMintValue.mul(`1e${decimals}`)
              minimalBurnValue = minimalBurnValue.mul(`1e${decimals}`)

              return giveTransactionResult(
                getContract(`custodian.${toCfxOrFromCfx}.${nonCfxChain}`).then(
                  (c) => {
                    const contract = c
                    if (!amount) {
                      return contract
                        .setTokenParams(
                          referenceOrCtoken,
                          burnFee,
                          mintFee,
                          walletFee,
                          minimalMintValue,
                          minimalBurnValue
                        )
                        .sendTransaction({ from: address })
                    } else {
                      return contract
                        .sponsorToken(
                          referenceOrCtoken,
                          amount,
                          burnFee,
                          mintFee,
                          walletFee,
                          minimalMintValue,
                          minimalBurnValue
                        )
                        .sendTransaction({ from: address })
                    }
                  }
                ),
                { done: cb }
              )
            },
          }
        })
      }
      return readTokenFromContract(token).then((data) => {
        return { ...token, ...data }
      })
    })
    .catch((e) => {
      console.log(e)
    })
}

function fetcher(key, search, chain, cToken) {
  const { display, searchList } = CHAIN_CONFIG[chain]
  return getTokenList(chain).then(({ tokenList }) => {
    if (!search) {
      return tokenList.filter(display)
    }

    return (cToken ? searchCfxList : searchList)(tokenList, search, chain).then(
      (e) => {
        console.log(e)
        return e
      }
    )
    // .then((list) => sortSearchResult(list))
  })
}

export default function useTokenList({ search, cToken } = {}) {
  const { chain } = useParams()

  return useSWR(['search', search, chain, cToken], fetcher, {
    suspense: true,
    revalidateOnMount: false,
  }).data
}

function searchCfxList(list, search, chain) {
  const lowerSearch = search.toLowerCase()
  const isAddressCfx = isCfxAddress(search)

  if (isAddressCfx) {
    return Promise.resolve(
      list.filter(({ ctoken }) => ctoken.toLowerCase() === lowerSearch)
    ).then((list) => {
      if (list.length === 1) {
        return list
      } else {
        return searchCfxFromServer(search, chain).then((result) => {
          return result ? [result] : []
        })
      }
    })
  } else {
    return Promise.resolve(
      list.filter(
        ({ reference_name, reference_symbol, ctoken, symbol, supported }) => {
          return (
            //DO NOT present unsupported with ctoken
            supported &&
            (ctoken === search ||
              reference_symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
              symbol.toLowerCase().indexOf(lowerSearch) > -1 ||
              reference_name.toLowerCase().indexOf(lowerSearch) > -1)
          )
        }
      )
    )
  }
}

function sortSearchResult(list) {
  return list
    .slice()
    .sort(
      (
        { supported: supported0, in_token_list: in_token_list0 },
        { supported: supported1, in_token_list: in_token_list1 }
      ) => {
        return supported1 - supported0 || in_token_list1 - in_token_list0
      }
    )
}

function searchCfxFromServer(addr, chain) {
  return jsonrpc('searchToken', {
    url: 'sponsor',
    params: ['cfx', chain, addr],
  }).then((result) => {
    if (result && result.is_valid_erc20) {
      const token = { ...result, origin: 'cfx', to_chain: chain }

      const updatedList = updateTokenList(chain, token)
      return updatedList.then(({ tokenMap }) => {
        return tokenMap[getIdFromToken(token)]
      })
    }
  })
}
