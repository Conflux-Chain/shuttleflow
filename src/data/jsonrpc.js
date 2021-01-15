import { NODE_URL, SPONSOR_URL } from '../config/config'
const URLS = {
  node: NODE_URL,
  sponsor: SPONSOR_URL,
}

export default function jsonrpc(method, data) {
  let { url, ...rest } = data
  url = URLS[url]
  // Default options are marked with *
  data = { id: 1, jsonrpc: '2.0', method, ...rest }
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      
      return json.result
    })
}
