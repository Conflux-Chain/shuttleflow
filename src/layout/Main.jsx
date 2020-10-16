import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Shuttle from '../shuttle/Shuttle'
import Token from '../token/Token'
import Caption from '../token/caption/Caption'
import History from '../history/History'
import Market from '../market/Market'
import Example from './Example'

function Main() {
  return (
    <Switch>
      <Redirect from={'/'} exact to="/shuttle" />
      <Route path="/token" component={Token} />
      <Route path="/shuttle" component={Shuttle} />
      <Route path="/caption" component={Caption} />
      <Route path="/history" component={History} />
      <Route path="/market" component={Market} />
      <Route path="/example" component={Example} />
    </Switch>
  )
}

export default React.memo(Main)
