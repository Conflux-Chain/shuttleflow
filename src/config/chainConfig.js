import { IS_DEV } from './config'
import jsonrpc from '../data/jsonrpc'
import WithQuestion from '../component/WithQuestion'
import Modal, { modalStyles } from '../component/Modal'
import { useState } from 'react'
import useStyle from '../component/useStyle'
import btcSrc from './bcoin.svg'
import ethSrc from './ether.svg'
import bscSrc from './bsc.svg'
import ethSubSrc from './eth-sub.svg'
import bscSubSrc from './bsc-sub.svg'

import { getTokenList, updateTokenList } from '../data/tokenList'
import { getIdFromToken } from '../util/id'
import { ETH_SCAN_URL, BSC_SCAN_URL } from './config'
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
    mainPair: 'btc-btc',
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
  //to document
  eth: {
    icon: ethSrc,
    subIcon: ethSubSrc,
    token: 'cETH',
    mainPair: 'eth-eth',
    tk_url: ETH_SCAN_URL + '/token/',
    tx_url: ETH_SCAN_URL + '/tx/',
    searchTokenFromServer: createSearchTokenFromServer('eth'),
    display: ({ supported, in_token_list }) => {
      return supported === 1 && in_token_list === 1
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
            return config['eth']
              .searchTokenFromServer(search)
              .then((result) => {
                return result ? [result] : []
              })
          }
        })
      }

      return Promise.resolve(
        list.filter(
          ({ reference_symbol, reference_name, in_token_list, supported  }) =>
            in_token_list === 1 && supported === 1 &&
            (reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
              reference_name.toLowerCase().indexOf(lowersearch) > -1)
        )
      )
    },
    captain: CAPTAIN.BOTH,
    outFormatCheck(address) {
      return WAValidator.validate(
        address,
        'ethereum',
        IS_DEV ? 'testnet' : 'prod'
      )
    },

    checkAddress() {
      return Promise.resolve('yes')
    },
    frequentTokens: IS_DEV
      ? [
          'eth',
          '0x08130635368aa28b217a4dfb68e1bf8dc525621c',
          '0x27cCd03D1ecCb2CbcED1EfbB18554BBfD526800A',
        ]
      : [
          'eth',
          '0xA1f82E14bc09A1b42710dF1A8a999B62f294e592', //ecfx
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
    subIcon: bscSubSrc,
    token: 'cBNB',
    mainPair: 'bsc-bnb',
    tk_url: BSC_SCAN_URL + '/address/',
    tx_url: BSC_SCAN_URL + '/tx/',
    captain: CAPTAIN.BOTH,
    display: ({ supported, in_token_list }) => {
      return supported === 1 && in_token_list === 1
    },
    searchTokenFromServer: createSearchTokenFromServer('bsc'),
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
            return config['bsc']
              .searchTokenFromServer(search)
              .then((result) => {
                return result ? [result] : []
              })
          }
        })
      }

      return Promise.resolve(
        list.filter(
          ({ reference_symbol, reference_name, in_token_list, supported }) =>
            in_token_list === 1 && supported === 1 &&
            (reference_symbol.toLowerCase().indexOf(lowersearch) > -1 ||
              reference_name.toLowerCase().indexOf(lowersearch) > -1)
        )
      )
    },
    outFormatCheck(address) {
      return WAValidator.validate(
        address,
        'ethereum',
        IS_DEV ? 'testnet' : 'prod'
      )
    },
    TokenList({ t }) {
      return <span>{t('list')}</span>
    },
    checkAddress() {
      return Promise.resolve('yes')
    },
    frequentTokens: IS_DEV
      ? [
          'bnb',
          '0xef3F743830078a9CB5ce39C212eC1Ca807E45FE1',
          '0x85Cb01537d294090AEe3cB836AaaD7D0306f143F',
        ]
      : ['bnb', '0x045c4324039dA91c52C55DF5D785385Aab073DcF'],
  },
}

export const SUPPORT_CHAINS = ['btc', 'eth', 'bsc']

export default config

function createSearchTokenFromServer(chain) {
  return function searchTokenFromServer(address) {
    return jsonrpc('searchToken', {
      url: 'sponsor',
      params: [chain, 'cfx', address],
    }).then((result) => {
      if (result && result.is_valid_erc20) {
        const token = { ...result, origin: chain, to_chain: 'cfx' }

        const updatedList = updateTokenList(chain, token)
        return updatedList.then(({ tokenMap }) => {
          return tokenMap[getIdFromToken(token)]
        })
      }
    })
  }
}
