import { useState } from 'react'
import useSWR from 'swr'
//confirm that every key in swr is cached 
//memory leak when highly dynamic key 
export default function Test() {
  const [id, setId] = useState(0)
  const { data, isValidating } = useSWR(['key', id], fetcher)
  return (
    <div>
      <div>{isValidating && 'loading..'}</div>
      <div>Value:{data}</div>
      <button
        onClick={() => {
          setId((id) => {
            return ++id % 3
          })
        }}
      >
        Btn
      </button>
    </div>
  )
}

function fetcher(key, id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(id)
    }, 3000)
  })
}
// function rootSwr(){}
