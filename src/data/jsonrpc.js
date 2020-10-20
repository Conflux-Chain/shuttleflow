//https://dev.shuttleflow.io
//http://23.102.224.244:8018

//https://rinkeby.etherscan.io/tx/
//https://etherscan.io/

//https://confluxscan.io/
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
