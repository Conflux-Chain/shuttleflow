import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import Choose from '../token/Choose'
import styles from './Captain.module.scss'
import CaptainForm from './Form'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

export default function Captain(props) {
  const {
    match: { url, path },
  } = props
  const [cx] = useStyle(styles)
  const fullHeight = useRouteMatch({ path, exact: true })

  return (
    <MainContainer
      style={{ minHeight: '100%' }}
      className={fullHeight ? cx('container') : ''}
    >
      <Switch>
        <Route exact path={path}>
          <div className={cx('container')}>
            <Choose next={(token) => `${url}/${token}`} captain />
          </div>
        </Route>
        <Route path={`${path}/:erc20`}>
          <CaptainForm />
        </Route>
      </Switch>
    </MainContainer>
  )
}
