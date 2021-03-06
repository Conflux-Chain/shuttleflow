import { Loading } from '@cfxjs/react-ui'
import styled from 'styled-components'
import { device } from '../../config/size'

export default function Button({ children, loading, ...props }) {
  return (
    <BaseButton {...props}>
      {loading ? <Loading color="white" size="1.5rem" /> : children}
    </BaseButton>
  )
}

export const BaseButton = styled.button`
  background: #44d7b6;
  color: white;
  box-shadow: 0px 0px 0px transparent;
  text-shadow: 0px 0px 0px transparent;
  border: 0px solid transparent;
  display: block;
  margin: auto;
  font-weight: 500;
  white-space: nowrap;
  width: ${(props) => (props.fullWidth ? '100%' : 'fit-content')};
  cursor: pointer;
  font-size: 16px;
  @media ${device.laptop} {
    height: 4.5rem;
  }
  @media ${device.mobile} {
    height: 6.875rem;
  }

  &:disabled {
    background: #9c9c9c;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
`
