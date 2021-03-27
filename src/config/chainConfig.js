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
import hecoSrc from './heco.svg'
import hecoSubSrc from './heco-sub.svg'

import { updateTokenList } from '../data/tokenList'
import { getIdFromToken } from '../util/id'

var WAValidator = require('wallet-address-validator')
const ETH_SCAN_URL = IS_DEV
  ? 'https://rinkeby.etherscan.io'
  : 'https://etherscan.io'
const BSC_SCAN_URL = IS_DEV
  ? 'https://testnet.bscscan.com'
  : 'https://bscscan.com'

const HECO_SCAL_URL = IS_DEV
  ? 'https://testnet.hecoinfo.com'
  : 'https://hecoinfo.com'

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
    subIcon: ethSubSrc,
    token: 'cETH',
    tk_url: ETH_SCAN_URL + '/token/',
    tx_url: ETH_SCAN_URL + '/tx/',
    cAddress: IS_DEV
      ? '0x8442bc8b5d01bf635bb12e6c63a379cb167ab5bb'
      : '0x86d2fb177eff4be03a342951269096265b98ac46', //ceth
    searchTokenFromServer(address) {
      console.log('address', address)
      return jsonrpc('searchToken', {
        url: 'sponsor',
        params: ['eth', 'cfx', address],
      }).then((result) => {
        if (result && result.is_valid_erc20) {
          const token = { ...result, origin: 'eth', to_chain: 'cfx' }

          const updatedList = updateTokenList('eth', token)
          return updatedList.then(({ tokenMap }) => {
            return tokenMap[getIdFromToken(token)]
          })
        }
      })
    },
    display: ({ supported, in_token_list, origin }) => {
      return origin === 'cfx' || (supported === 1 && in_token_list === 1)
    },
    searchList: function filterEth(list, search) {
      const isEthAddress = config['eth'].outFormatCheck(search)
      const lowersearch = search.toLowerCase()

      // debugger
      if (isEthAddress) {
        console.log('search', search)
        return Promise.resolve(
          list.filter(
            ({ reference }) => reference.toLowerCase() === lowersearch
          )
        ).then((list) => {
          if (list.length === 1) {
            console.log('list', list)
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
    tk_url: BSC_SCAN_URL + '/address/',
    tx_url: BSC_SCAN_URL + '/tx/',
    captain: CAPTAIN.NONE,
    display: ({ supported, origin }) => {
      return origin === 'cfx' || supported === 1
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
            return []
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
  heco: {
    icon: hecoSrc,
    subIcon: hecoSubSrc,
    tk_url: HECO_SCAL_URL + '/address/',
    tx_url: HECO_SCAL_URL + '/tx/',
    captain: CAPTAIN.NONE,
    display: ({ supported, origin }) => {
      return origin === 'cfx' || supported === 1
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
            return []
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
    frequentTokens: IS_DEV ? ['ht'] : ['ht'],
  },
}

export const SUPPORT_CHAINS = ['btc', 'eth', 'bsc']

export default config
