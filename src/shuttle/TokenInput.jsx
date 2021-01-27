import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import useStyle from '../component/useStyle'
import inputStyles from './TokenInput.module.scss'
import commonInputStyles from '../component/input.module.scss'
import arrow from './i-right-56.png'
import Icon from '../component/Icon/Icon'
import WithQuestion from '../component/WithQuestion'
import useIsSamll from '../component/useSmallScreen'
import { buildSearch } from '../component/urlSearch'

export default function TokenInput({ tokenInfo, cToken, to, placeholder }) {
  const history = useHistory()
  const isSmall = useIsSamll()
  const { chain } = useParams()
  const match = useRouteMatch()
  const [tkInputCx, commonCx] = useStyle(inputStyles, commonInputStyles)
  return (
    <div
      onClick={() =>
        history.push({
          pathname: `/${chain}/token`,
          search: buildSearch({ next: match.url, cToken: !!cToken }),
        })
      }
      className={tkInputCx('container') + ' ' + commonCx('input-common')}
    >
      <div className={tkInputCx('left')}>
        {tokenInfo ? (
          <>
            <Icon
              src={tokenInfo.icon}
              conflux={cToken}
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

      <div>
        <img alt="arrow" className={tkInputCx('arrow')} src={arrow}></img>
      </div>
    </div>
  )
}
