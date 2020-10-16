import React from 'react'
import cIcon from './cToken.svg'
export default function CIcon({ img }) {
  return (
    <div style={{ position: 'relative' }}>
      {img}
      <img src={cIcon} style={{ position: 'absolute', right: 0 }}></img>
    </div>
  )
}
