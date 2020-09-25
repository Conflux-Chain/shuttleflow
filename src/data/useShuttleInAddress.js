import useSWR from 'swr'
export default function useShuttleInAddress(tokenAddress, accountAddress) {
  const { data } = useSWR(
    tokenAddress ? `/api/shuttleIn/${accountAddress + tokenAddress}` : null,
    fetcher
  )
  return data
}

function fetcher() {
  console.log('start fetch')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('resolve')
      resolve('0xdac17f958d2ee523a2206206994597c13d831ec7')
    }, 2000)
  })
}
