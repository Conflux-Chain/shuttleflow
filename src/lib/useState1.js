import { useReducer } from 'react'
function reducer(state, action) {
  return { ...state, ...action }
}
export default function useState1(init) {
  return useReducer(reducer, init)
}
