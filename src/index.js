import React from 'react'
import ReactDOM from 'react-dom'
import App from './layout/Root'



import Big from 'big.js'



Big.PE = 80
Big.NE = -20
//disable scroll
document.body.style.overflow = 'hidden'


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
