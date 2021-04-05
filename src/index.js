import React from 'react'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './state'
import App from './layout/Root'
import { NetworkContextName } from './constants'

import getLibrary from './util/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

import Big from 'big.js'

Big.PE = 80
Big.NE = -20
//disable scroll
window.document.body.style.overflow = 'hidden'
import './global.css'


ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <App />
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
