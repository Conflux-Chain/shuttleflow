import useStyle from '../useStyle'
import styles from './Toggle.module.scss'

export default function Toggle({ value = 'on', onChange }) {
  const [cx] = useStyle(styles)
  return (
    <div
      className={cx('container', { on: value === 'on', off: value === 'off' })}
    >
      <div onClick={onChange} className={cx('btn')}></div>
    </div>
  )
}
