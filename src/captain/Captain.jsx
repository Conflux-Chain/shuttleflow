import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import Choose from '../token/Choose'
import styles from './Captain.module.scss'
import CaptainForm from './FormProvider'
import { useRouteMatch } from 'react-router-dom'
import useUrlSearch from '../data/useUrlSearch'

export default function Captain() {
  const [cx] = useStyle(styles)
  const { pair } = useUrlSearch()
  const { url } = useRouteMatch()

  return (
    <MainContainer
      style={{ minHeight: '100%' }}
      className={!pair ? cx('container') : ''}
    >
      {pair ? (
        <CaptainForm pair={pair} />
      ) : (
        <div className={cx('container')}>
          <Choose next={(token) => `${url}?pair=${token}`} captain />
        </div>
      )}
    </MainContainer>
  )
}
