import { IS_DEV } from './config'
import jsonrpc from '../data/jsonrpc'
import WithQuestion from '../component/WithQuestion'
import Modal, { modalStyles } from '../component/Modal'
import { useState } from 'react'
import useStyle from '../component/useStyle'
import btcSrc from './bcoin.svg'
import ethSrc from './ether.svg'
import bscSrc from './bsc.svg'
var WAValidator = require('wallet-address-validator')

export const CAPTAIN = {
  NONE: 0,
  TO_CFX: 1,
  TO_REF: 2,
  BOTH: 3,
}
const config = {
  btc: {
    icon: btcSrc,
    display() {
      return true
    },
    captain: CAPTAIN.NONE,
    // set the singleton one as default when no token selected
    singleToken: true,
    outFormatCheck(address) {
      return WAValidator.validate(
        address,
        'bitcoin',
        IS_DEV ? 'testnet' : 'prod'
      )
    },
    checkAddress() {
      return Promise.resolve('yes')
    },
  },
  eth: {
    icon: ethSrc,
    display: ({ supported, in_token_list, origin }) => {
      return origin === 'cfx' || (supported === 1 && in_token_list === 1)
    },
    searchList: function filterEth(list, search) {
      const isEthAddress = config['eth'].outFormatCheck(search)
      const lowersearch = search.toLowerCase()
      if (isEthAddress) {
        return Promise.resolve(
          list.filter(
            ({ reference }) => reference.toLowerCase() === lowersearch
          )
        ).then((list) => {
          if (list.length === 1) {
            return list
          } else {
            return jsonrpc('searchToken', {
              url: 'sponsor',
              params: [search],
            }).then((result) => {
              if (result && result.is_valid_erc20) {
                return [result]
              } else {
                return []
              }
            })
          }
        })
      }

      return Promise.resolve(
        list.filter(
          ({ reference_symbol, reference_name }) =>
            reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
            reference_name.toLowerCase().indexOf(lowersearch) > -1
        )
      )
    },
    captain: CAPTAIN.TO_CFX,
    outFormatCheck(address) {
      return WAValidator.validate(
        address,
        'ethereum',
        IS_DEV ? 'testnet' : 'prod'
      )
    },

    checkAddress(address = '', blockShuttleout, t) {
      if (address.startsWith('0x1')) {
        return jsonrpc('getEthNonce', {
          url: 'sponsor',
          params: [address],
        })
          .then((x) => {
            if (x > 0) {
              return 'eth'
            } else {
              return window.confluxJS.getNextNonce(address).then((x) => {
                if (x.toString() === '0') {
                  return 'tbd'
                } else {
                  return 'conflux'
                }
              })
            }
          })
          .then((x) => {
            return new Promise((resolve) => {
              if (x === 'eth') {
                resolve('yes')
              } else {
                blockShuttleout(resolve, t(`confirm.${x}`))
              }
            })
          })
      } else {
        return Promise.resolve('yes')
      }
    },
    frequentTokens: [
      'btc',
      'eth',
      '0xdac17f958d2ee523a2206206994597c13d831ec7', //usdt
      '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', //usdc
    ],
    TokenList({ t }) {
      const [modalCx] = useStyle(modalStyles)
      const [popup, setPopup] = useState(false)
      return (
        <>
          <WithQuestion onClick={() => setPopup(true)}>
            <span>{t('list')}</span>
          </WithQuestion>
          <Modal
            show={popup}
            title={t('list')}
            onClose={() => setPopup(false)}
            clickAway={() => setPopup(false)}
          >
            <div
              style={{
                textAlign: 'center',
              }}
              className={modalCx('content')}
            >
              {t('gecko')}
            </div>
            <div
              onClick={() =>
                window.open(
                  'https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json',
                  '_blank'
                )
              }
              className={modalCx('btn')}
            >
              {t('gecko-btn')}
            </div>
          </Modal>
        </>
      )
    },
  },
  bsc: {
    icon: bscSrc,
    display: ({ supported, in_token_list, origin }) => {
      return origin === 'cfx' || (supported === 1 && in_token_list === 1)
    },
    searchList: function filterEth(list, search) {
      const isEthAddress = config['eth'].outFormatCheck(search)
      const lowersearch = search.toLowerCase()
      if (isEthAddress) {
        return Promise.resolve(
          list.filter(
            ({ reference }) => reference.toLowerCase() === lowersearch
          )
        ).then((list) => {
          if (list.length === 1) {
            return list
          } else {
            return jsonrpc('searchToken', {
              url: 'sponsor',
              params: [search],
            }).then((result) => {
              if (result && result.is_valid_erc20) {
                return [result]
              } else {
                return []
              }
            })
          }
        })
      }

      return Promise.resolve(
        list.filter(
          ({ reference_symbol, reference_name }) =>
            reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
            reference_name.toLowerCase().indexOf(lowersearch) > -1
        )
      )
    },
    captain: CAPTAIN.TO_CFX,
    outFormatCheck(address) {
      return WAValidator.validate(
        address,
        'ethereum',
        IS_DEV ? 'testnet' : 'prod'
      )
    },

    checkAddress(address = '', blockShuttleout, t) {
      if (address.startsWith('0x1')) {
        return jsonrpc('getEthNonce', {
          url: 'sponsor',
          params: [address],
        })
          .then((x) => {
            if (x > 0) {
              return 'eth'
            } else {
              return window.confluxJS.getNextNonce(address).then((x) => {
                if (x.toString() === '0') {
                  return 'tbd'
                } else {
                  return 'conflux'
                }
              })
            }
          })
          .then((x) => {
            return new Promise((resolve) => {
              if (x === 'eth') {
                resolve('yes')
              } else {
                blockShuttleout(resolve, t(`confirm.${x}`))
              }
            })
          })
      } else {
        return Promise.resolve('yes')
      }
    },
    frequentTokens: [
      'btc',
      'eth',
      '0xdac17f958d2ee523a2206206994597c13d831ec7', //usdt
      '0x6b175474e89094c44da98b954eedeac495271d0f', // dai
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', //usdc
    ],
    TokenList({ t }) {
      const [modalCx] = useStyle(modalStyles)
      const [popup, setPopup] = useState(false)
      return (
        <>
          <WithQuestion onClick={() => setPopup(true)}>
            <span>{t('list')}</span>
          </WithQuestion>
          <Modal
            show={popup}
            title={t('list')}
            onClose={() => setPopup(false)}
            clickAway={() => setPopup(false)}
          >
            <div
              style={{
                textAlign: 'center',
              }}
              className={modalCx('content')}
            >
              {t('gecko')}
            </div>
            <div
              onClick={() =>
                window.open(
                  'https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json',
                  '_blank'
                )
              }
              className={modalCx('btn')}
            >
              {t('gecko-btn')}
            </div>
          </Modal>
        </>
      )
    },
  },
}

delete config.bsc
export const SUPPORT_CHAINS = ['btc', 'eth']

export default config
