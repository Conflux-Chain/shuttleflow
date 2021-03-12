import useMyCaptain from '../data/useMyCaptain'
export default function CaptainCenter() {
  const { data } = useMyCaptain()

  console.log(data)

  return (
    <div>
      Captain center
      {data.map((tokenInfo, i) => (
        <CaptainItem key={i} tokenInfo={tokenInfo} />
      ))}
    </div>
  )
}

function CaptainItem({ tokenInfo }) {
  console.log(tokenInfo)
  return <div>Item</div>
}
