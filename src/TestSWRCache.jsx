import { Suspense } from 'react'
import useSWR from 'swr'
export default function Test() {
  return (
    <div>
      <Suspense fallback="loading...">
        <Child1></Child1>
      </Suspense>
      <Suspense fallback="loading...">
        <Child2></Child2>
      </Suspense>
    </div>
  )
}

function Child1() {
  const { data } = useSWR('hello', fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  })
  return <div>child1:{data + ''}</div>
}
function Child2() {
  const { data } = useSWR('world', fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
    suspense: true,
  })
  return <div>child2:{data + ''}</div>
}

let i = 0
function fetcher(key) {
  console.log(key, 'invoke fetcher')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++i)
    }, 3000)
  })
}
