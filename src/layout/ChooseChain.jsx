import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router'
import CHAIN_CONFIG, { SUPPORT_CHAINS } from '../config/chainConfig'
import Select from './Select'
export default function ChooseChain() {
  const history = useHistory()
  const { chain } = useParams()
  const { t } = useTranslation()
  return (
    <Select
      type="chain"
      icon
      setCurrent={(v) => history.push(`/${v}`)}
      render={renderChainSelect}
      current={chain}
      dropdownTitle={t('choose-chain')}
      options={SUPPORT_CHAINS.map((key) => {
        return {
          key,
          value: key,
        }
      })}
    />
  )
}

function renderChainSelect({ key, title }) {
  return (
    <div
      style={{
        marginRight: title ? '' : '1rem',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
        src={CHAIN_CONFIG[key].icon}
        alt="icon"
      ></img>
      <span
        style={{ color: title ? 'white' : '#333333', marginRight: '0.2rem' }}
      >
        {key.toUpperCase()}
      </span>{' '}
      <span
        style={{ color: title ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
      >
        {' /Conflux'}
      </span>
    </div>
  )
}
