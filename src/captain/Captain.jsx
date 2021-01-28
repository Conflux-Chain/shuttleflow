import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import Choose from '../token/Choose'
import styles from './Captain.module.scss'
import CaptainForm from './FormProvider'
import { useRouteMatch } from 'react-router-dom'
import useUrlSearch from '../data/useUrlSearch'

export default function Captain() {
  const [cx] = useStyle(styles)
  const { erc20 } = useUrlSearch()
  const { url } = useRouteMatch()

  return (
    <MainContainer
      style={{ minHeight: '100%' }}
      className={!erc20 ? cx('container') : ''}
    >
      {erc20 ? (
        <CaptainForm erc20={erc20} />
      ) : (
        <div className={cx('container')}>
          <Choose next={(token) => `${url}?erc20=${token}`} captain />
        </div>
      )}
    </MainContainer>
  )
}
