import React from 'react'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './state'
import App from './layout/Root'
import { CfxProvider, CssBaseline } from '@cfxjs/react-ui'
import { NetworkContextName } from './constants'
import * as Sentry from "@sentry/browser"
import { Integrations } from "@sentry/tracing"
import { IS_DEV } from './config/config'
import getLibrary from './util/getLibrary'
import ApplicationUpdater from './state/application/updater'
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

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
    </>
  )
}
Sentry.init({
  dsn:
    'https://a7cbd76115cf498e868552d00c19e3ac@o339419.ingest.sentry.io/5718839',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: IS_DEV ? 'development' : 'production',
})

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <CfxProvider>
            <Updaters/>
            <App />
          </CfxProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
