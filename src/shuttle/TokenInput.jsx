import { useHistory } from 'react-router-dom'
import useStyle from '../component/useStyle'
import inputStyles from './TokenInput.module.scss'
import commonInputStyles from '../component/input.module.scss'
import arrow from './i-right-56.png'
import question from '../component/question.svg'
import Icon from '../component/Icon/Icon'

export default function TokenInput({ tokenInfo, cToken, to, placeholder }) {
  const history = useHistory()
  const [shuttleCx, commonCx] = useStyle(inputStyles, commonInputStyles)
  return (
    <div
      onClick={() => history.push(to)}
      className={shuttleCx('container') + ' ' + commonCx('input-common')}
    >
      <div className={shuttleCx('left')}>
        {tokenInfo ? (
          <>
            <Icon src={tokenInfo.icon} conflux={cToken} size="2rem" />

            <span className={shuttleCx('symbol')}>
              {tokenInfo[cToken ? 'symbol' : 'reference_symbol']}
            </span>

            {cToken && (
              <div
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  cToken()
                }}
                className={shuttleCx('question-area')}
              >
                <img
                  alt="?"
                  className={shuttleCx('question')}
                  src={question}
                ></img>
              </div>
            )}
          </>
        ) : (
          <span className={shuttleCx('placeholder')}>{placeholder}</span>
        )}
      </div>

      <div>
        <img alt="arrow" className={shuttleCx('arrow')} src={arrow}></img>
      </div>
    </div>
  )
}
