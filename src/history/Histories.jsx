import React, { useState } from 'react'
import HistoryItem from './HistoryItem'

export default function Histories({ histories }) {
  const [opend, setOpened] = useState(-1)
  return histories.map((props, i) => {
    return (
      <HistoryItem
        key={i}
        opened={opend===i}
        setOpened={setOpened}
        idx={i}
        {...props}
      />
    )
  })
}
