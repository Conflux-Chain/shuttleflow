import React, { useRef } from 'react'

export default function Accordion({ expanded, title, content }) {
    const ref = useRef(null)
    return <div>
        <div>
            {title}
        </div>
        <div ref={ref} style={
            {
                maxHeight: (expanded ? ref.current && ref.current.scrollHeight : 0) + 'px',
                overflow: 'hidden',
                transition: 'max-height 0.3s'
            }
        }>
            {content}
        </div>
    </div>

}