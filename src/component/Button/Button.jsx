import { Loading } from '@cfxjs/react-ui'
import styled from 'styled-components'
import { device } from '../../config/size'

export default function Button({ children, loading, ...props }) {
  return (
    <StyledButton {...props}>
      {loading ? <Loading color="white" size="1.5rem" /> : children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  background: #44d7b6;
  color: white;
  box-shadow: 0px 0px 0px transparent;
  text-shadow: 0px 0px 0px transparent;
  border: 0px solid transparent;
  display: block;
  margin: auto;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  @media ${device.laptop} {
    font-size: 1.25rem;
    height: 4.5rem;
  }
  @media ${device.mobile} {
    height: 6.875rem;
    font-size: 2rem;
  }

  &:disabled {
    background: #9c9c9c;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
`
