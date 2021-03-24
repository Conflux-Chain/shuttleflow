import React from 'react'
import ReactDOM from 'react-dom'
import App from './layout/Root'

import Big from 'big.js'

Big.PE = 80
Big.NE = -20
//disable scroll
window.document.body.style.overflow = 'hidden'
import './global.css'

const isNew = window.ConfluxJSSDK
  ? window.ConfluxJSSDK?.format?.hexAddress
  : true

ReactDOM.render(
  <React.StrictMode>
    {isNew ? <App /> : <h1>Update conflux portal to latest</h1>}
  </React.StrictMode>,
  document.getElementById('root')
)
