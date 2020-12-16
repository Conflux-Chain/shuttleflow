import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import Choose from '../token/Choose'
import styles from './Caption.module.scss'
import CaptionForm from './Form'
import { Switch, Route } from 'react-router-dom'

export default function Caption(props) {
  const {
    match: { url, path },
  } = props
  const [cx] = useStyle(styles)

  return (
    <Switch>
      <Route exact path={path}>
        <MainContainer className={cx('container')}>
          <Choose next={(token) => `${url}/${token}`} caption />
        </MainContainer>
      </Route>
      <Route path={`${path}/:erc20`}>
        <CaptionForm />
      </Route>
    </Switch>
  )
}
