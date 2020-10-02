import React from 'react'
import Choose from '../choose/Choose'
import CaptionForm from './Form'

export default function Caption(props) {
  const {
    location: { search }, match: { url }
  } = props
  const token = new URLSearchParams(decodeURI(search)).get('token')
  if (token) {
    return <CaptionForm token={token} />
  } else {
    return <Choose {...props} next={url} caption />
  }
}
