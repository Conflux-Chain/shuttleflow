import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import Button from '../component/Button/Button'
import TokenInput from '../component/TokenInput/TokenInput'
import { CHAIN_SINGLE_PAIR } from '../config/constant'
import useTokenList from '../data/useTokenList'
import Select from '../layout/Select'
import useUrlSearch from '../lib/useUrlSearch'
// import { useFallbackLocalStorage } from '../lib/useLocalstorage'

export default function AddToken() {
  const { t } = useTranslation([])
  const { chain } = useParams()
  const history = useHistory()
  const { pair } = useUrlSearch()
  const [localPair] = useLocalStorageForPair('addToken-pair', pair, 'value')
  const tokenInfo = useTokenList({ pair: pair || CHAIN_SINGLE_PAIR })

  const [fromChain, setFromChain] = useLocalStorageForChain(
    'addtoken-fromChain',
    tokenInfo ? tokenInfo.origin : ''
  )
  const [toChain, setToChain] = useLocalStorageForChain(
    'addtoken-toChain',
    tokenInfo ? tokenInfo.to_chain : ''
  )

  console.log({ fromChain, toChain })

  //token can be choosen when both chains are specified
  const bothChain = fromChain && toChain

  const options = [
    { value: t('cfx'), key: 'cfx' },
    { value: t(chain), key: chain },
  ]

  useEffect(() => {
    //when switching fromChain the same as toChain
    //reset toChain

    const others = options.filter(({ key }) => {
      return key !== fromChain
    })
    if (others.length === 1) {
      setToChain(others[0].key)
    }
  }, [fromChain, toChain])

  return (
    <div>
      <Row>
        <SelectContainer>
          <SelectChain
            options={options}
            {...{ choosen: fromChain, setChoosen: setFromChain }}
          />
        </SelectContainer>
        <InputContainer>
          <TokenInput
            captain
            chainFilter={fromChain}
            tokenInfo={tokenInfo}
            disabled={!bothChain}
            cToken={fromChain === 'cfx'}
            placeholder={t('placeholder.out')}
          />
        </InputContainer>
      </Row>
      <Row>
        <SelectContainer>
          <SelectChain
            options={options.filter(({ key }) => {
              return key !== fromChain
            })}
            // options={options}
            disabled={!fromChain}
            {...{ choosen: toChain, setChoosen: setToChain }}
          />
        </SelectContainer>
        <InputContainer>
          <TokenInput
            captain
            chainFilter={toChain}
            tokenInfo={tokenInfo}
            cToken={toChain === 'cfx'}
            disabled={!bothChain}
            placeholder={t('placeholder.out')}
          />
        </InputContainer>
      </Row>
      <Button
        fullWidth
        disabled={!pair}
        onClick={() => {
          history.push(`/${chain}/captain?pair=${pair}`)
        }}
      >
        Next
      </Button>
    </div>
  )
}

function SelectChain({ choosen, setChoosen, disabled, options }) {
  console.log('SelectChain', options)
  const { t } = useTranslation()

  function render({ title, key }) {
    return <div style={{ color: title ? 'white' : '#333333' }}>{t(key)}</div>
  }

  return (
    <Select
      disabled={disabled}
      render={render}
      dropdownTitle="cc"
      current={choosen}
      title={choosen ? false : 'Choose'}
      setCurrent={setChoosen}
      icon={!disabled}
      options={options}
    />
  )
}

const Row = styled.div`
  display: flex;
  position: relative;
`
const SelectContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`
const InputContainer = styled.div`
  flex: 3;
`

function useLocalStorageForChain(localKey, chainFromToken) {
  const [externalSet, setExternalSet] = useState(false)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(localKey)
      return item ? JSON.parse(item) : chainFromToken
    } catch (error) {
      return chainFromToken
    }
  })

  const _setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(localKey, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }
  useEffect(() => {
    if (chainFromToken && !externalSet) {
      _setValue(chainFromToken)
    }
  }, [chainFromToken, externalSet])

  const setChainExternal = (value) => {
    setExternalSet(true)
    _setValue(value)
  }

  return [storedValue, setChainExternal]
}

export function useLocalStorageForPair(localKey, pair) {
  const history = useHistory()
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [localPair, setStoredValue] = useState(() => {
    // if (pair) {
    //   return pair
    // }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(localKey)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : pair
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return pair
    }
  })


  useEffect(() => {
    if (pair) {
      setValue(pair)
    } else {
      if (localPair) {
        history.push({ search: `?pair=${localPair}` })
      }
    }
  }, [localPair, pair])

  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(localPair) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(localKey, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [localPair]
}
