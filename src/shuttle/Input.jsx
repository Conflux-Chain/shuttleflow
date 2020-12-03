import React, { forwardRef } from 'react'
import useStyle from '../component/useStyle'
import commonInputStyles from '../component/input.module.scss'

function Input(
  {
    value, //only useful to decide placeholder
    name,
    error,
    placeholder,
    onChange,
  },
  ref
) {
  const [commonCx] = useStyle(commonInputStyles)

  return (
    <div>
      <input
        type="text"
        data-lpignore="true"
        autoComplete="off"
        onChange={onChange}
        ref={ref}
        name={name}
        className={commonCx('input-common', { error })}
      />

      {!value && <div className={commonCx('placeholder')}>{placeholder}</div>}
    </div>
  )
}

export default forwardRef(Input)
