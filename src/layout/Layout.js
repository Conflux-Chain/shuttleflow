import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import '../i18n/i18n'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import useIsSamll from '../component/useSmallScreen'
import { RecoilRoot } from 'recoil'

export default function App() {
  const isSmall = useIsSamll()

  const {
    useEnsurePortalLogin,
  } = useConfluxPortal([
    '0x87010faf5964d67ed070bc4b8dcafa1e1adc0997', // fc contract address
    '0x85b1432b900ec2552a3f119d4e99f4b0f8078e29', // ceth contract address
  ])
  useEnsurePortalLogin()

  return (
    <RecoilRoot>
      <Router>
        <Route path="/" component={isSmall ? LayoutSmall : LayoutLarge}></Route>
      </Router>
    </RecoilRoot>
  )
}
