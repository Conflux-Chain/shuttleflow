import React from 'react'
import useStyle from '../useStyle'
import styles from './PaddingContainer.module.scss'
/**
 * We can not specify padding at a root level
 * it will cause trouble especially when the full
 * width is required
 *
 * We should specify the paddding at a more detailed level
 */
export default function PaddingContainer({
  children,
  bottom = true,
  className,
  ...props
}) {
  const [cx] = useStyle(styles)
  return (
    <div {...props} className={className + ' ' + cx('container', { bottom })}>
      {children}
    </div>
  )
}
