import React, { useState, useRef, useEffect } from 'react'
import useStyle from '../component/useStyle'
import inputStyles from './Input.module.scss'
import commonInputStyles from '../component/input.module.scss'

import { Link } from 'react-router-dom'

import question from '../component/question.svg'
import arrow from './arrow.svg'
import cIcon from '../component/cIcon.svg'

export default function Input({
  tokenInfo,
  to,
  defaultValue,
  placeholder,
  icon,
  cToken,
}) {
  const [fontWidth, setFontWidth] = useState('')
  const cTokenInputRef = useRef(null)
  const [shuttleCx, commonCx] = useStyle(inputStyles, commonInputStyles)

  useEffect(() => {
    if (tokenInfo) {
      console.log(cTokenInputRef)
      console.log(cTokenInputRef.current)
      const input = getComputedStyle(cTokenInputRef.current)
      const font = input.getPropertyValue('font')
      const paddingLeft = input.getPropertyValue('padding-left')
      const width = get_tex_width(tokenInfo.symbol, font)
      setFontWidth(`calc(${width}px + ${paddingLeft} + 1rem)`)
    }
  }, [tokenInfo])

  return (
    <div className={shuttleCx('container', { 'with-icon': !!tokenInfo })}>
      {tokenInfo && (
        <>
          <img alt="icon" className={shuttleCx('icon')} src={icon}></img>
          {cToken && (
            <img alt="icon" className={shuttleCx('c-icon')} src={cIcon}></img>
          )}
        </>
      )}
      <input
        ref={cTokenInputRef}
        readOnly
        className={commonCx('input-common')}
        defaultValue={defaultValue}
        placeholder={placeholder}
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
      <Link to={to}>
        <img alt="arrow" className={shuttleCx('arrow')} src={arrow}></img>
      </Link>
    </div>
  )
}

function get_tex_width(txt, font) {
  const element = document.createElement('canvas')
  const context = element.getContext('2d')
  context.font = font
  return context.measureText(txt).width
}
