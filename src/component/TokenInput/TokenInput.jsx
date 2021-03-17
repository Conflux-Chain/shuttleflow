import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import useStyle from '../useStyle'
import tokenInputStyles from './TokenInput.module.scss'
import commonInputStyles from '../input.module.scss'
import arrow from './i-right-56.png'
import Icon from '../Icon/Icon'
import WithQuestion from '../WithQuestion'
import useIsSamll from '../useSmallScreen'
import { buildSearch } from '../urlSearch'
import { useTranslation } from 'react-i18next'
import CTokenPopup from '../../shuttle/CTokenPopup'
import { useState } from 'react'

export default function TokenInput({
  tokenInfo,
  cToken,
  placeholder,
  dir,
  displayCopy,
  chain,
}) {
  const history = useHistory()
  const isSmall = useIsSamll()
  const { chain: urlChain } = useParams()
  const match = useRouteMatch()
  const { t } = useTranslation()
  const [cTokenPopup, setCTokenPopup] = useState(false)
  chain = chain || urlChain

  const [tkInputCx, commonCx] = useStyle(tokenInputStyles, commonInputStyles)
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
      <div className={tkInputCx('txt')}>
        {t(dir, { value: t(cToken ? 'Conflux' : chain) })}
      </div>
      <div
        onClick={
          !singleton
            ? () =>
                history.push({
                  pathname: `/${chain}/token`,
                  search: buildSearch({
                    next: match.url,
                    ...(cToken && { cToken: 1 }),
                  }),
                })
            : undefined
        }
        style={{ cursor: singleton ? '' : 'pointer' }}
        className={tkInputCx('container') + ' ' + commonCx('input-common')}
      >
        <div className={tkInputCx('left')}>
          {tokenInfo ? (
            <>
              <Icon
                {...tokenInfo}
                cToken={!!cToken}
                size={isSmall ? '3rem' : '2rem'}
              />

              <span className={tkInputCx('symbol')}>
                {tokenInfo[cToken ? 'symbol' : 'reference_symbol']}
              </span>

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
            <span className={tkInputCx('placeholder')}>{placeholder}</span>
          )}
        </div>

        {!singleton && (
          <div>
            <img alt="arrow" className={tkInputCx('arrow')} src={arrow}></img>
          </div>
        )}
      </div>
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
