import React from 'react'
import ReactDOM from 'react-dom'
import App from './layout/Layout'

import Big from 'big.js'

Big.PE = 80
Big.NE = -20

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
