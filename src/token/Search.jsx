import seachStyle from './Search.module.scss'
import inputStyle from '../component/input.module.scss'
import clear from '../component/clear.svg'
import searchIcon from './search.svg'
import { useTranslation } from 'react-i18next'
import useStyle from '../component/useStyle'

export default function Search({ searchTxt, setSearchTxt }) {
  const { t } = useTranslation(['token'])
  const [searchCx, inputCx] = useStyle(seachStyle, inputStyle)
  return (
    <div className={searchCx('input')}>
      <img
        className={searchCx('search-icon')}
        alt="search"
        src={searchIcon}
      ></img>
      <input
        className={inputCx('input-common')}
        onChange={(e) => {
          setSearchTxt(e.target.value)
        }}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        value={searchTxt}
        placeholder={t('search')}
      />
      <img
        style={{ display: searchTxt ? 'block' : 'none' }}
        onClick={() => setSearchTxt('')}
        src={clear}
        alt="clear"
        className={inputCx('clear')}
      ></img>
    </div>
  )
}
