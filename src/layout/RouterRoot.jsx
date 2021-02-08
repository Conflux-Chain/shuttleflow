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
import { DEFAULT_CHAIN } from '../config/config'
import useTokenList from '../data/useTokenList'

export default function RouterRoot() {
  return (
    <Router>
      <Switch>
        <Route path="/:chain" component={ChainChecker}></Route>
        <Redirect from="/" exact to={`/${DEFAULT_CHAIN}`}></Redirect>
      </Switch>
    </Router>
  )
}

function ChainChecker(props) {
  const isSmall = useIsSamll()
  const { chain } = useParams()
  //useTokenList here to serve as a prefetch 
  //and suspend the underlying rendering
  //Give the underlying component need some time to load 
  //window?.conflux?.selectedAddress correctly in order to 
  //determine the if the user logged in 
  useTokenList()

  //backwark compitable with old url where :chain do not specify
  return CHAIN_CONFIG[chain] ? (
    //layout depend on "chain", i.e. if captain is present
    isSmall ? (
      <LayoutSmall {...props} />
    ) : (
      <LayoutLarge {...props} />
    )
  ) : (
    <Redirect to={`/${DEFAULT_CHAIN}`}></Redirect>
  )
}
