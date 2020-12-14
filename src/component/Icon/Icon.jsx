import confluxSvg from './conflux.svg'
import styled from 'styled-components'
export default function Icon({ src, conflux, size = '3rem', style, ...props }) {
  return (
    <Container {...props} style={{ ...style, width: size, height: size }}>
      <SrcIcon alt="icon" src={src}></SrcIcon>
      {conflux && <Conflux alt="shuttle" src={confluxSvg}></Conflux>}
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
  right: 0;
  bottom: 0;
`
