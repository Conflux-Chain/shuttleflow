import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import useIsSamll from '../component/useSmallScreen'
import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'

export default function RouterRoot() {
  const isSmall = useIsSamll()
  return (
    <Router>
      <Switch>
        <Route
          path="/:chain"
          //layout depend on "chain", i.e. if captain is present
          component={isSmall ? LayoutSmall : LayoutLarge}
        ></Route>
        <Redirect to="/eth"></Redirect>
      </Switch>
    </Router>
  )
}
