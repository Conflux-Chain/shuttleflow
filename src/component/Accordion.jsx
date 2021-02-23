import React, { useRef, useEffect } from 'react'

export default function Accordion({
  expanded,
  title,
  content,
  contentStyle = {},
  clickAway,
}) {
  const scrollRef = useRef(null)
  const clickAwayRef = useRef(null)
  useEffect(() => {
    if (clickAway) {
      const listener = (e) => {
        if (!clickAwayRef.current.contains(e.target)) {
          clickAway()
        }
      }
      window.addEventListener('mousedown', listener)
      return () => {
        window.removeEventListener('mousedown', listener)
      }
    }
  }, [clickAway])
  return (
    <div ref={clickAwayRef}>
      {title}
      <div
        ref={scrollRef}
        style={{
          maxHeight:
            (expanded
              ? scrollRef.current && scrollRef.current.scrollHeight
              : 0) + 'px',
          overflow: 'hidden',
          transition: 'max-height 0.3s',
          zIndex: 1,
          ...contentStyle,
        }}
      >
        {content}
      </div>
    </div>
  )
}
