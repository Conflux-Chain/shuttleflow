import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import '../i18n/i18n'

import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import useIsSamll from '../component/useSmallScreen'
import { RecoilRoot } from 'recoil'
// import useConfluxPortal from '../data/portal/useConfluxPortal.js'

export default function App() {
  const isSmall = useIsSamll()

  // addreess: user address
  // balance: cfx balance
  // token balance: same order as input token list (1st arg), will be empty array if no token list provided
  // conflux: portal api
  // confluxJS: js-conflux-sdk instance with portal as rpc provider
  // login: request user portal authrorization
  // const [portalInstalled, address, [balance, tokensBalance], chainId, login, [conflux, confluxJS]] = useConfluxPortal(
  //   [
  //     '0x87010faf5964d67ed070bc4b8dcafa1e1adc0997', // token addreess
  //     '0x8f50e31a4e3201b2f7aa720b3754dfa585b4dbfa',
  //     '0x8d0ff27dbdb98f40530cc213d78d0665d5e5893a',
  //   ],
  //   1000 // interval of refreshing balance, no interval if pass 0 or leave undefined
  // );
  // console.log('address', address) //null
  return (
    <RecoilRoot>
      <Router>
        <Route path="/" component={isSmall ? LayoutSmall : LayoutLarge}></Route>
      </Router>
    </RecoilRoot>
  )
}
