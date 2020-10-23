import React, { useState, useRef, useEffect, forwardRef } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from './Input.module.scss'
import commonInputStyles from '../component/input.module.scss'

import question from '../component/question.svg'
import arrow from './arrow.svg'
import cIcon from '../component/cIcon.svg'
import { useHistory } from 'react-router-dom'

console.log(inputStyles)

function Input(
  {
    value, //only useful to decide placeholder
    tokenInfo,
    to,
    name,
    error,
    defaultValue,
    placeholder,
    icon,
    cToken,
    onChange,
    style,
  },
  ref
) {
  const [fontWidth, setFontWidth] = useState('')
  const history = useHistory()
  const localRef = useRef(null)
  const cTokenInputRef = ref || localRef
  const [shuttleCx, commonCx] = useStyle(inputStyles, commonInputStyles)

  useEffect(() => {
    if (tokenInfo && cTokenInputRef.current) {
      const input = getComputedStyle(cTokenInputRef.current)
      const font = input.getPropertyValue('font')
      const paddingLeft = input.getPropertyValue('padding-left')
      const width = get_tex_width(tokenInfo.symbol, font)
      setFontWidth(`calc(${width}px + ${paddingLeft} + 1rem)`)
    }
  }, [tokenInfo, cTokenInputRef])

  return (
    <div
      onClick={() => {
        if (typeof to === 'object') {
          history.push(to)
        }
      }}
      className={shuttleCx(
        'container',
        { 'with-icon': !!tokenInfo },
        { to: !!to }
      )}
    >
      {tokenInfo && (
        <>
          <img alt="icon" className={shuttleCx('icon')} src={icon}></img>
          {cToken && (
            <img alt="icon" className={shuttleCx('c-icon')} src={cIcon}></img>
          )}
        </>
      )}
      <input
        data-lpignore="true"
        autoComplete="new-password"
        onChange={onChange}
        ref={cTokenInputRef}
        readOnly={!name}
        name={name}
        style={style}
        className={commonCx('input-common', { error })}
        defaultValue={defaultValue}
      />
      {fontWidth && cToken && (
        <img
          onClick={cToken}
          alt="?"
          className={shuttleCx('question')}
          style={{ left: fontWidth }}
          src={question}
        ></img>
      )}
      {to && <img alt="arrow" className={shuttleCx('arrow')} src={arrow}></img>}
      {!value && !defaultValue && (
        <div className={commonCx('placeholder')}>{placeholder}</div>
      )}
    </div>
  )
}

export default forwardRef(Input)

function get_tex_width(txt, font) {
  const element = document.createElement('canvas')
  const context = element.getContext('2d')
  context.font = font
  return context.measureText(txt).width
}
