import styled from 'styled-components'

export const Input = styled.div`
  width: 100%;
  background-color: rgba(105, 105, 105, 0.2);
  color: white;
  border: none;
  text-overflow: ellipsis;
  font-size: 16px;
  height: 56px;
  padding-left: 16px;
  &:focus {
    box-shadow: none;
    outline: none;
  }
`
