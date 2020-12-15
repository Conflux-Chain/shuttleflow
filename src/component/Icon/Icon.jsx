import confluxSvg from './conflux.svg'
import riskSrc from './risk.svg'
import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import displyRiskAtom from '../../state/displyRisk'
export default function Icon({
  src,
  risk,
  conflux,
  size = '3rem',
  style,
  ...props
}) {
  const [, setDisplayRisk] = useRecoilState(displyRiskAtom)
  return (
    <Container {...props} style={{ ...style, width: size, height: size }}>
      <SrcIcon alt="icon" src={src}></SrcIcon>
      {conflux && <Conflux alt="shuttle" src={confluxSvg}></Conflux>}
      {risk && (
        <Risk
          onClick={(e) => {
            e.stopPropagation()
            setDisplayRisk(true)
          }}
          src={riskSrc}
        />
      )}
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

const Conflux = styled.img`
  position: absolute;
  width: 1rem;
  height: 1rem;
  right: -0.2rem;
  bottom: -0.2rem;
`

const Risk = styled.img`
  position: absolute;
  cursor: help;
  width: 1rem;
  height: 1rem;
  left: 0;
  top: 0;
`
