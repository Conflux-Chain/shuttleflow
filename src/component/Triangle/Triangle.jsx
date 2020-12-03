import React from 'react'
import useStyle from '../useStyle'
import styles from './Triangle.module.scss'

import up from './i-up-34.png'
import down from './i-down-34.png'
import upActive from './i-up-active-34.png'
import downActive from './i-down-active-34.png'

const IMAGES = {
  up,
  down,
  upActive,
  downActive,
}

export default function ({ reverse, active, onClick }) {
  const [cx] = useStyle(styles)
  return (
    <img
      className={cx('img')}
      onClick={onClick}
      alt="direction"
      src={IMAGES[`${reverse ? 'down' : 'up'}${active ? 'Active' : ''}`]}
    ></img>
  )
}
