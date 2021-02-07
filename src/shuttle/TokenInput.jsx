import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import useStyle from '../component/useStyle'
import tokenInputStyles from './TokenInput.module.scss'
import commonInputStyles from '../component/input.module.scss'
import arrow from './i-right-56.png'
import Icon from '../component/Icon/Icon'
import WithQuestion from '../component/WithQuestion'
import useIsSamll from '../component/useSmallScreen'
import { buildSearch } from '../component/urlSearch'
import { useTranslation } from 'react-i18next'

export default function TokenInput({ tokenInfo, cToken, placeholder, dir }) {
  const history = useHistory()
  const isSmall = useIsSamll()
  const { chain } = useParams()
  const match = useRouteMatch()
  const { t } = useTranslation()
  const [tkInputCx, commonCx] = useStyle(tokenInputStyles, commonInputStyles)
  const singleton = tokenInfo && tokenInfo.singleton

  const origin = tokenInfo && tokenInfo.origin
  console.log(origin, chain, cToken)
  const a = {
    ...(origin === chain && cToken && { conflux: true }),
    ...(origin === 'cfx' && !cToken && { eth: true }),
  }

  console.log(a)
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

              {cToken && (
                <WithQuestion
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    cToken()
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
    </>
  )
}
