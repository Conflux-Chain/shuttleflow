import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useParams,
} from 'react-router-dom'
import useIsSamll from '../component/useSmallScreen'
import LayoutLarge from './LayoutLarge'
import LayoutSmall from './LayoutSmall'
import CHAIN_CONFIG from '../config/chainConfig'

export default function RouterRoot() {
  return (
    <Router>
      <Switch>
        <Route path="/:chain" component={ChainChecker}></Route>
        <Redirect from="/" exact to="/eth"></Redirect>
      </Switch>
    </Router>
  )
}

function ChainChecker(props) {
  const isSmall = useIsSamll()
  const { chain } = useParams()

  //backwark compitable with old url where :chain do not specify
  return CHAIN_CONFIG[chain] ? (
    //layout depend on "chain", i.e. if captain is present
    isSmall ? (
      <LayoutSmall {...props} />
    ) : (
      <LayoutLarge {...props} />
    )
  ) : (
    <Redirect to="/eth"></Redirect>
  )
}
