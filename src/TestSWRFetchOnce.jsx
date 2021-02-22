import { useEffect, useState } from 'react'
import useSWR, { cache } from 'swr'
export default function Test() {
  const [mount, setMount] = useState(false)
  return (
    <div>
      {mount ? <Child /> : 'unnounted'}
      <button onClick={() => setMount((x) => !x)}>switch mount</button>
    </div>
  )
}

function Child() {
  const { data, revalidate } = useSWR('key', fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  })
  useEffect(() => {
    if (!cache.get('key')) {
      revalidate()
    }
  }, [revalidate])
  return <div>{data}</div>
}

function fetcher() {
  console.log('fetcher is call')
  return Promise.resolve('hello')
}
