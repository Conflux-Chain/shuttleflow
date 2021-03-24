import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams, useRouteMatch } from 'react-router'
import styled from 'styled-components'
import Button from '../component/Button/Button'
import TokenInput from '../component/TokenInput/TokenInput'
import { CHAIN_SINGLE_PAIR } from '../config/constant'
import useTokenList from '../data/useTokenList'
import Select from '../layout/Select'
import useUrlSearch from '../lib/useUrlSearch'

export default function AddToken() {
  const { t } = useTranslation([])
  const { chain } = useParams()
  const history = useHistory()
  const { pair } = useUrlSearch()
  const tokenInfo = useTokenList({ pair: pair || CHAIN_SINGLE_PAIR })

  console.log('tokenInfo', tokenInfo)
  const [fromChain, setFromChain] = useState(tokenInfo ? tokenInfo.origin : '')
  const [toChain, setToChain] = useState(tokenInfo ? tokenInfo.to_chain : '')

  //token can be choosen when both chains are specified
  const bothChain = fromChain && toChain

  const options = [
    { value: t('cfx'), key: 'cfx' },
    { value: t(chain), key: chain },
  ]

  useEffect(() => {
    //when switching fromChain the same as toChain
    //reset toChain
    if (fromChain === toChain) {
      setToChain('')
    } else if (fromChain !== 'cfx') {
      setToChain('cfx')
    }
  }, [fromChain])

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
  const { t } = useTranslation()

  function render({ title, key }) {
    return <div style={{ color: title ? 'white' : '#333333' }}>{t(key)}</div>
  }

  useEffect(() => {
    if (options.length === 1) {
      setChoosen(options[0].key)
    }
  }, [options.length, choosen])

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
