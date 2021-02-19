import confluxSvg from './conflux.svg'
import ethSvg from './eth.svg'
import riskSrc from './risk.svg'
import styled from 'styled-components'
import { useParams } from 'react-router'
import icons from '../../data/tokenIcons'
export default function Icon({
  icon,
  origin,
  in_token_list,
  risk,
  size = '3rem',
  style,
  cToken,
  ...props
}) {
  const { chain } = useParams()
  const confluxIcon = origin === chain && cToken
  const chainIcon = origin === 'cfx' && !cToken

  return (
    <Container {...props} style={{ ...style, width: size, height: size }}>
      <SrcIcon alt="icon" src={icon}></SrcIcon>
      {confluxIcon && (
        <ShuttleIcon alt="shuttle" src={confluxSvg}></ShuttleIcon>
      )}
      {chainIcon && <ShuttleIcon alt="shuttle" src={ethSvg}></ShuttleIcon>}
      {!in_token_list && <Risk src={riskSrc} />}
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
