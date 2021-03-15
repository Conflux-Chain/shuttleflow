import confluxSvg from './conflux.svg'
import riskSrc from './risk.svg'
import styled from 'styled-components'
import { useParams } from 'react-router'
import CHAIN_CONFIG from '../../config/chainConfig'

function ListCx() {
  return ''
}
export default function Icon({
  icon,
  origin,
  in_token_list,
  risk,
  size,
  style,
  symbol,
  name,
  reference_symbol,
  reference_name,
  cToken,
  supported,
  txt,
  ...props
}) {
  const { chain } = useParams()
  const confluxIcon = origin === chain && cToken
  const chainIcon =
    origin === 'cfx' && !cToken ? CHAIN_CONFIG[chain].subIcon : false
  const symbolName = cToken ? symbol : reference_symbol
  const fullname = cToken ? name : reference_name
  const notAvailable = supported === 0

  return (
    <Container {...props} style={{ ...style }}>
      <IconContainer style={{ width: size, height: size }}>
        <SrcIcon alt="icon" src={icon}></SrcIcon>
        {confluxIcon && (
          <ShuttleIcon alt="shuttle" src={confluxSvg}></ShuttleIcon>
        )}
        {chainIcon && <ShuttleIcon alt="shuttle" src={chainIcon}></ShuttleIcon>}
        {!in_token_list && <Risk src={riskSrc} />}
      </IconContainer>
      {txt && (
        <TextContainer>
          <SymbolRow>
            <Symbol>
              {symbolName.length > 10
                ? symbolName.slice(0, 10) + '...'
                : symbolName}
            </Symbol>

            {notAvailable && (
              <span className={ListCx('not-available')}>
                {t('not-available')}
              </span>
            )}
          </SymbolRow>

          <Name>
            {fullname.length > 30 ? fullname.slice(0, 30) + '...' : fullname}
          </Name>
        </TextContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
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

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
`

const Risk = styled.img`
  position: absolute;
  width: 1rem;
  height: 1rem;
  left: 0;
  top: 0;
`

const TextContainer = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
`

const SymbolRow = styled.div`
  display: flex;
  align-items: center;
`

const Symbol = styled.div`
  color: white;
  font-weight: 500;
  font-size: 16px;
`

const Name = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
`
