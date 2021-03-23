import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
// import Choose from '../token/Choose'
import styles from './Captain.module.scss'
import CaptainForm from './FormProvider'
import CaptainCenter from './CaptainCenter'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import useUrlSearch from '../lib/useUrlSearch'
import Choose from './Choose'

export default function Captain() {
  const [cx] = useStyle(styles)
  const { pair, choose } = useUrlSearch()
  const match = useRouteMatch()

  return (
    <MainContainer
      style={{ minHeight: '100%' }}
      className={!pair ? cx('container') : ''}
    >
      {/* {pair?} */}
      <Switch>
        <Route path={`${match.path}/add`} component={Choose}></Route>
        {/* <Route path={`${match.path}/:pair`} component={Choose}>
          <CaptainForm pair={pair} />
        </Route> */}
        <Route path={`${match.path}`}>
          <CenterWrapper />
        </Route>
      </Switch>
      {/* {choose ? (
        <Choose />
      ) : pair ? (
        <CaptainForm pair={pair} />
      ) : (
        <CaptainCenter />
        // <div className={cx('container')}>
        //   <Choose next={(token) => `${url}?pair=${token}`} captain />
        // </div>
      )} */}
    </MainContainer>
  )
}

function CenterWrapper() {
  const { pair, choose } = useUrlSearch()
  return pair ? <CaptainForm pair={pair} /> : <CaptainCenter />
}
