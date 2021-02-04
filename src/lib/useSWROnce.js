import { useEffect } from 'react'
import useSWR, { cache } from 'swr'
//todo: https://github.com/vercel/swr/discussions/956
export default function useSWRONCE(key, fetcher) {
  const swrRst = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    // refreshInterval: 0,
  })
  const { revalidate } = swrRst
  useEffect(() => {
    console.log('cache.get(key)', cache.get(key))
    if (!cache.get(key)) {
      revalidate()
    }
  }, [revalidate, key])
  return swrRst
}
