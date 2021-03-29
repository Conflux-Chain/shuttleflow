import Icon from '../component/Icon/Icon'
import useMyCaptain from '../data/useMyCaptain'
import CHAIN_CONFIG from '../config/chainConfig'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import plusSrc from './plus.svg'
import configSrc from './config.svg'
import { BaseButton } from '../component/Button/Button'
import notFound from './not-found.svg'
import warning from './warning-yellow.svg'

import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import { Loading } from '@cfxjs/react-ui'
import { useHistory, useRouteMatch } from 'react-router'
import { getIdFromToken } from '../util/id'
import { useCustodianInfo } from '../data/useCaptainInfo'
export default function CaptainCenter() {
  const { data } = useMyCaptain()
  const { t } = useTranslation(['captain'])
  const history = useHistory()
  const match = useRouteMatch()
  return (
    <PaddingContainer top style={{ backgroundColor: '#1b1b1b' }}>
      <Title>
        <span>{t('supported')}</span>
        <Flex
          onClick={() => {
            history.push(`${match.url}/add`)
          }}
          style={{ cursor: 'pointer' }}
        >
          <img src={plusSrc}></img>
          <span>{t('support')}</span>
        </Flex>
      </Title>

      {data.length > 0 ? (
        data.map((tokenInfo, i) => (
          <CaptainItem key={i} t={t} tokenInfo={tokenInfo} />
        ))
      ) : (
        <NotFound>
          <img src={notFound}></img>
          <div>{t('no-supported-token')}</div>
        </NotFound>
      )}
    </PaddingContainer>
  )
}

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  padding-bottom: 32px;
  color: rgba(255, 255, 255, 0.6);
  img {
    width: 160px;
    height: 160px;
  }
`

function CaptainItem({ tokenInfo, t }) {
  const { origin, to_chain, sponsor_value, status } = tokenInfo
  const { minimal_sponsor_amount } = useCustodianInfo(tokenInfo)

  const isLow = sponsor_value < minimal_sponsor_amount.mul('2')

  const nonCfxChain = [origin, to_chain].filter((x) => x !== 'cfx')[0]
  const nonCfxChainConfig = CHAIN_CONFIG[nonCfxChain]
  const nonCfxChainIcon = nonCfxChainConfig.icon
  const nonCfxChainToken = nonCfxChainConfig.token
  const history = useHistory()

  return (
    <div>
      <Line>
        <Icon {...tokenInfo} txt />
        <Right>
          <Row>
            <ChainIcon src={nonCfxChainIcon} alt="chain" />
            <Name>
              <ChainName>{String(nonCfxChain).toUpperCase()}</ChainName>
              <CfxName>/Conflux</CfxName>
            </Name>
          </Row>
          <Mortgage isLow={isLow}>
            {isLow ? <img src={warning}></img> : null}
            {t('mortgage-amount') +
              ': ' +
              sponsor_value +
              '' +
              nonCfxChainToken}
          </Mortgage>
        </Right>
      </Line>
      {status !== 'done' && (
        <Status>
          <LoadingContainer>
            <Loading size="10px"></Loading>
          </LoadingContainer>
          <span>{t(`status.${status}`)}</span>
        </Status>
      )}

      {status === 'done' ? (
        <Button
          onClick={() => {
            history.push({ search: `pair=${getIdFromToken(tokenInfo)}` })
          }}
        >
          <IconContainer>
            <ImgIcon src={configSrc} alt="config"></ImgIcon>
          </IconContainer>
          <span>{t('config')}</span>
        </Button>
      ) : (
        <Button disabled>{t('configuring')}</Button>
      )}
    </div>
  )
}

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const Line = styled.div`
  display: flex;
  justify-content: space-between;
`
const Title = styled(Line)`
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  color: #999999;
  margin-bottom: 32px;
`

const Right = styled.div``

const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Mortgage = styled(Row)`
  font-size: 14px;
  color: ${(props) => (props.isLow ? '#FFC438' : 'white')};
  margin-bottom: 32px;
  img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
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

const Status = styled.div`
  font-size: 14px;
  color: white;
  display: flex;
  margin-top: -16px;
  margin-bottom: 16px;
`

const LoadingContainer = styled.span`
  width: 10px;
  margin-right: 4px;
  position: relative;
`

const Button = styled(BaseButton)`
  padding: 0 12px;
  margin-bottom: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 82px;
  height: 40px;
  line-height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`

const ImgIcon = styled.img`
  width: 14px;
  height: 14px;
`
const IconContainer = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`
