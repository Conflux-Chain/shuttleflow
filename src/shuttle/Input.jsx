import React, { forwardRef, useEffect, useState, useRef } from 'react'
import useStyle from '../component/useStyle'
import commonInputStyles from '../component/input.module.scss'

function ShuttleOutInput(
  { showPlaceholder, name, error, placeholder, decimals },
  ref
) {
  const [commonCx] = useStyle(commonInputStyles)
  const [displayPlaceholder, setDisplayPlaceholder] = useState(true)
  const oldValue = useRef('')
  useEffect(() => {
    if (!showPlaceholder) {
      setDisplayPlaceholder(true)
    }
  }, [showPlaceholder])

  return (
    <div>
      <input
        type="text"
        data-lpignore="true"
        autoComplete="off"
        {...['onFocus', 'onBlur'].reduce((pre, cur) => {
          pre[cur] = (e) => {
            console.log(e.target.value)
            setDisplayPlaceholder(!e.target.value)
          }
          return pre
        }, {})}
        onKeyDown={(e) => {
          oldValue.current = e.target.value
        }}
        onChange={(e) => {
          if (decimals) {
            const value = e.target.value
            let [p0, p1] = (value + '').split('.')
            if ((p0 && p0.length > 40) || (p1 && p1.length > decimals)) {
              // console.log()
              e.target.value = oldValue.current
            }
          }
          setDisplayPlaceholder(!e.target.value)
        }}
        ref={ref}
        name={name}
        className={commonCx('input-common', { error })}
      />

      {displayPlaceholder && (
        <div className={commonCx('placeholder')}>{placeholder}</div>
      )}
    </div>
  )
}

export default forwardRef(ShuttleOutInput)
