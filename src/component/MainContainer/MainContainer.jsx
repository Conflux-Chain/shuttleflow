import { Fragment } from 'react'
import styled from 'styled-components'
import useIsSamll from '../useSmallScreen'

export default function MainContainer({ children, ...props }) {
  const isSmall = useIsSamll()
  const Container = isSmall ? SmallContainer : LargeContainer

  return <Container {...props}>{children}</Container>
}

const LargeContainer = styled.div`
  background-color: #1b1b1b;
  border-radius: 0.5rem;
`
const SmallContainer = styled.div``
