import React from 'react'
export default function MainContainer({ children, ...props }) {
  return (
    <div
      {...props}
      style={{ backgroundColor: '#1b1b1b', borderRadius: '0.5rem' }}
    >
      {children}
    </div>
  )
}
