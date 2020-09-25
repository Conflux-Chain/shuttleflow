import React from 'react'
import Choose from './Choose'
import CaptionForm from './Form'

export default function Caption(props) {
  const {
    location: { search },
  } = props
  const token = new URLSearchParams(decodeURI(search)).get('token')
  if (token) {
    return <CaptionForm token={token} />
  } else {
    return <Choose {...props} />
  }
}
