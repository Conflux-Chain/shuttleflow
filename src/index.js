import React from 'react'
import ReactDOM from 'react-dom'
import App from './layout/Root'

import Big from 'big.js'
import * as Sentry from "@sentry/browser"
import { Integrations } from "@sentry/tracing"
import { IS_DEV } from './config/config'
Big.PE = 80
Big.NE = -20
//disable scroll
window.document.body.style.overflow = 'hidden'
import './global.css'

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
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
