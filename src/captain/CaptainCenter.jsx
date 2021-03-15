import Icon from '../component/Icon/Icon'
import useMyCaptain from '../data/useMyCaptain'
import CHAIN_CONFIG from '../config/chainConfig'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
export default function CaptainCenter() {
  const { data } = useMyCaptain()
  const { t } = useTranslation(['captain'])
  console.log(data)

  return (
    <div>
      {data.map((tokenInfo, i) => (
        <CaptainItem key={i} t={t} tokenInfo={tokenInfo} />
      ))}
    </div>
  )
}

function CaptainItem({ tokenInfo, t }) {
  console.log(tokenInfo)
  const { origin, to_chain, sponsor_value } = tokenInfo
  const nonCfxChain = [origin, to_chain].filter((x) => x !== 'cfx')[0]
  const nonCfxChainConfig = CHAIN_CONFIG[nonCfxChain]
  const nonCfxChainIcon = nonCfxChainConfig.icon
  const nonCfxChainToken = nonCfxChainConfig.token
  console.log(nonCfxChainIcon)
  return (
    <Container>
      <Icon {...tokenInfo} txt />
      <Right>
        <Row>
          <ChainIcon src={nonCfxChainIcon} alt="chain" />
          <Name>
            <ChainName>{String(nonCfxChain).toUpperCase()}</ChainName>
            <CfxName>/Conflux</CfxName>
          </Name>
        </Row>
        <Row>
          {t('mortgage-amount') + sponsor_value + '' + nonCfxChainToken}
        </Row>
      </Right>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`

const Right = styled.div``

const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
`
const Name = styled.span``
const ChainName = styled.span`
  font-size: 16px;
  color: white;
  margin-left: 8px;
  margin-right: 4px;
`
const CfxName = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`
