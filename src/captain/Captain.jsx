import MainContainer from '../component/MainContainer/MainContainer'
import CaptainForm from './Form'
import CaptainCenter from './CaptainCenter'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import useUrlSearch from '../lib/useUrlSearch'
import AddToken from './AddToken'

export default function Captain() {
  const match = useRouteMatch()

  return (
    <MainContainer>
      <Switch>
        <Route path={`${match.path}/add`} component={AddToken}></Route>
        <Route path={`${match.path}`}>
          <CenterWrapper />
        </Route>
      </Switch>
    </MainContainer>
  )
}

function CenterWrapper() {
  const { pair } = useUrlSearch()
  return pair ? <CaptainForm pair={pair} /> : <CaptainCenter />
}
