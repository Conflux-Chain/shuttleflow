import useStyle from '../useStyle'
import styles from './Toggle.module.scss'

export default function Toggle({ value, onChange }) {
  const [cx] = useStyle(styles)
  return (
    <div onClick={onChange} className={cx('container', value ? 'on' : 'off')}>
      <div className={cx('btn')}></div>
    </div>
  )
}
