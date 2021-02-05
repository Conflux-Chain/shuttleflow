import confluxSvg from './conflux.svg'
import ethSvg from './eth.svg'
import riskSrc from './risk.svg'
import styled from 'styled-components'
export default function Icon({
  src,
  risk,
  conflux,
  eth,
  size = '3rem',
  style,
  ...props
}) {
  return (
    <Container {...props} style={{ ...style, width: size, height: size }}>
      <SrcIcon alt="icon" src={src}></SrcIcon>
      {conflux && <ShuttleIcon alt="shuttle" src={confluxSvg}></ShuttleIcon>}
      {eth && <ShuttleIcon alt="shuttle" src={ethSvg}></ShuttleIcon>}
      {risk && <Risk src={riskSrc} />}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
`

const SrcIcon = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`

const ShuttleIcon = styled.img`
  position: absolute;
  width: 1rem;
  height: 1rem;
  right: -0.2rem;
  bottom: -0.2rem;
`

const Risk = styled.img`
  position: absolute;
  width: 1rem;
  height: 1rem;
  left: 0;
  top: 0;
`
