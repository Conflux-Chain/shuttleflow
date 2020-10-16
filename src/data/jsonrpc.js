//https://dev.shuttleflow.io
//http://23.102.224.244:8018
const URLS = {
  node: 'https://dev.shuttleflow.io',
  sponsor: 'http://23.102.224.244:8018',
}

export default function jsonrpc(method, data) {
  let { url, ...rest } = data
  url = URLS[url]
  // Default options are marked with *
  data = { id: 1, jsonrpc: '2.0', method, ...rest }
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      return json.result
    })
}
