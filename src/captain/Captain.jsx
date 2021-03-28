import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import styles from './Captain.module.scss'
import CaptainForm from './FormProvider'
import CaptainCenter from './CaptainCenter'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import useUrlSearch from '../lib/useUrlSearch'
import AddToken from './AddToken'

export default function Captain() {
  const [cx] = useStyle(styles)
  const { pair } = useUrlSearch()
  const match = useRouteMatch()

  return (
    <MainContainer
      style={{ minHeight: '100%' }}
      className={!pair ? cx('container') : ''}
    >
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
