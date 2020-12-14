import React, { Suspense } from 'react'
import MainContainer from '../component/MainContainer/MainContainer'
import useStyle from '../component/useStyle'
import Choose from '../token/Choose'
import styles from './Caption.module.scss'
import CaptionForm from './Form'

export default function Caption(props) {
  const {
    location: { search },
    match: { url },
  } = props
  const token = new URLSearchParams(decodeURI(search)).get('token')
  const [cx] = useStyle(styles)
  if (token) {
    return (
      <Suspense fallback={<div>loading...</div>}>
        <CaptionForm token={token} />
      </Suspense>
    )
  } else {
    return (
      <MainContainer className={cx('container')}>
        <Choose {...props} next={url} caption />
      </MainContainer>
    )
  }
}
