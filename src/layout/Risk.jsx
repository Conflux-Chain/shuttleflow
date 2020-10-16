import React, { useState } from 'react'
import Modal from '../component/Modal'

export default function Risk() {
  const [checked, setChecked] = useState(false)
  const [display, setDisplay] = useState(!localStorage.getItem('risk'))
  return (
    <Modal show={display}>
      <div>risk</div>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((x) => !x)}
      />
      <button
        disabled={!checked}
        onClick={() => {
          localStorage.setItem('risk', true)
          setDisplay(false)
        }}
      >
        知道了
      </button>
    </Modal>
  )
}
