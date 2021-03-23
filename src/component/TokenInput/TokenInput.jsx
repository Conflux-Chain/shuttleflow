import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import arrow from './i-right-56.png'
import Icon from '../Icon/Icon'
import WithQuestion from '../WithQuestion'
import useIsSamll from '../useSmallScreen'
import { buildSearch } from '../urlSearch'
import { useTranslation } from 'react-i18next'
import CTokenPopup from '../../shuttle/CTokenPopup'
import { useState } from 'react'
import { Input } from '../Input'
import styled from 'styled-components'

export default function TokenInput({
  tokenInfo,
  cToken,
  placeholder,
  dir,
  displayCopy,
  chain,
  disabled,
  next,
}) {
  const history = useHistory()
  const isSmall = useIsSamll()
  const { chain: urlChain } = useParams()
  const match = useRouteMatch()
  const { t } = useTranslation()
  const [cTokenPopup, setCTokenPopup] = useState(false)
  chain = chain || urlChain

  const { singleton, origin, symbol, reference, reference_symbol, ctoken } =
    tokenInfo || {}

  let question
  //display conflux, need question mark when conflux asset is not orginal
  if (cToken) {
    if (origin !== 'cfx') {
      question = {
        displaySymbol: symbol,
        address: ctoken,
        chain: ' Conflux ',
        chainTool: 'ConfluxPortal',
      }
    }
  } else {
    if (origin !== chain) {
      question = {
        displaySymbol: reference_symbol,
        address: reference,
        chain: t(chain),
        chainTool: 'MetaMask',
      }
    }
  }

  return (
    <>
      <Caption>{t(dir, { value: t(cToken ? 'Conflux' : chain) })}</Caption>
      <Container
        disabled={disabled}
        singleton={singleton}
        onClick={
          !singleton
            ? () => {
                if (!disabled) {
                  history.push({
                    pathname: `/${chain}/token`,
                    search: buildSearch({
                      next: next || match.url,
                      ...(cToken && { cToken: 1 }),
                    }),
                  })
                }
              }
            : undefined
        }
      >
        <Left>
          {tokenInfo ? (
            <>
              <Icon
                {...tokenInfo}
                cToken={!!cToken}
                size={isSmall ? '3rem' : '2rem'}
              />
              <Symbol>
                {tokenInfo[cToken ? 'symbol' : 'reference_symbol']}
              </Symbol>

              {question && (
                <WithQuestion
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCTokenPopup(true)
                  }}
                ></WithQuestion>
              )}
            </>
          ) : (
            <Placeholder>{placeholder}</Placeholder>
          )}
        </Left>

        {!singleton && !disabled && (
          <div>
            <Arrow src={arrow}></Arrow>
          </div>
        )}
      </Container>
      <CTokenPopup
        displayCopy={displayCopy}
        cTokenPopup={cTokenPopup}
        setCTokenPopup={setCTokenPopup}
        tokenInfo={tokenInfo}
        {...question}
      />
    </>
  )
}

const Container = styled(Input)`
  position: relative;
  display: flex;
  cursor: ${(props) =>
    props.disabled ? 'not-allowed' : props.singleton ? 'default' : 'pointer'};
`
const Left = styled.div`
  display: flex;
  align-items: center;
`
const Placeholder = styled.span`
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
`
const Symbol = styled.span`
  font-weight: bold;
  margin-left: 1rem;
`

const Arrow = styled.img`
  top: 0;
  bottom: 0;
  position: absolute;
  margin: auto;
  display: flex;
  width: 1.75rem;
  right: 1.5rem;
`

const Caption = styled.div`
  color: rgba($color: #ffffff, $alpha: 0.6);
  margin-bottom: 0.5rem;
  font-size: 1rem;
`
