import styled from 'styled-components'
import question from './question.svg'
export default function WithQuestion({ children, onClick, className, style }) {
  return (
    <Container className={className}>
      {children}
      <Img onClick={onClick} src={question} alt={question}></Img>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
`
const Img = styled.img`
  cursor: pointer;
  width: 1.25rem;
  margin-left: 1rem;
`
