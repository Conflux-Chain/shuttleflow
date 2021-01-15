import styled from 'styled-components'
import question from './question.svg'
import useIsSamll from './useSmallScreen'
export default function WithQuestion({ children, onClick, className, style }) {
  const isSmall = useIsSamll()
  return (
    <Container className={className}>
      {children}
      <Img
        style={{ width: isSmall ? '2rem' : '1.25rem' }}
        onClick={onClick}
        src={question}
        alt={question}
      ></Img>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
`
const Img = styled.img`
  cursor: pointer;
  margin-left: 1rem;
`
