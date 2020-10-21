import React from 'react'
export default function renderThumbVertical({ style, ...props }) {
  return (
    <div
      style={{
        ...style,
        ...{
          backgroundColor: 'rgba(229, 229, 229, 0.11)',
          borderRadius: '3px',
        },
      }}
      {...props}
    />
  )
}
