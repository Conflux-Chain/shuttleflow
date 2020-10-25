import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import '../i18n/i18n'
import { useConfluxPortal } from '@cfxjs/react-hooks'
import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import useIsSamll from '../component/useSmallScreen'
import Risk from './Risk'
import { RecoilRoot } from 'recoil'

export default function App() {
  const isSmall = useIsSamll()

  const { address, useEnsurePortalLogin } = useConfluxPortal()
  useEnsurePortalLogin()

  return (
    <RecoilRoot>
      <Router>
        <Route path="/" component={isSmall ? LayoutSmall : LayoutLarge}></Route>
      </Router>
      <Risk />
    </RecoilRoot>
  )
}
