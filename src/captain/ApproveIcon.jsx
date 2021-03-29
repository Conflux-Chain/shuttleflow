import styled, { keyframes } from 'styled-components'
import toApprove from './approve.svg'
import approved from './approve2.svg'
import approving from './approve3.svg'

const STATUS = { toApprove, approved, approving }
export default function ApproveIcon({ status }) {
  const Container = status === 'approving' ? RotateImg : Img
  return <Container status={status} src={STATUS[status]}></Container>
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Img = styled.img`
  width: 20px;
  height: 20px;
  cursor: ${(props) => (props.status === 'approved' ? 'default' : 'pointer')};
`

const RotateImg = styled(Img)`
  animation: ${rotate} 2s linear infinite;
`
