import React from 'react'
export default function renderThumbVertical({
  style,
  backgroundColor,
  ...props
}) {
  return (
    <div
      style={{
        ...style,
        ...{
          backgroundColor: backgroundColor || 'rgba(229, 229, 229, 0.11)',
          borderRadius: '3px',
        },
      }}
      {...props}
    />
  )
}

export function renderThumbVerticalDark({ style, backgroundColor, ...props }) {
  return (
    <div
      style={{
        ...style,
        ...{
          backgroundColor: 'rgba(0, 0, 0, 0.11)',
          borderRadius: '3px',
        },
      }}
      {...props}
    />
  )
}
