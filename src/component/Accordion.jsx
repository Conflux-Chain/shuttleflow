import React, { useRef } from 'react'

export default function Accordion({ expanded, title, content }) {
    const ref = useRef(null)
    return <div>
        <div>
            {title}
        </div>
        <div ref={ref} style={
            {
                maxHeight: (expanded ? ref.current.scrollHeight : 0) + 'px',
                overflow: 'hidden',
                transition:'max-height 1s'
            }
        }>
            {content}
        </div>
    </div>

}