import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import styled from 'styled-components'
import TokenInput from '../component/TokenInput/TokenInput'
import Select from '../layout/Select'

export default function Choose() {
  const [fromChain, setFromChain] = useState()
  const [toChain, setToChain] = useState()
  const { t } = useTranslation()
  const { chain } = useParams()

  //token can be choosen when both chains are specified
  const bothChain = fromChain && toChain

  console.log(fromChain, toChain)
  const options = [
    { value: 'Conflux', key: 'Conflux' },
    { value: t(chain), key: chain },
    // { value: t('bsc'), key: 'bsc' },
  ]

  useEffect(() => {
    //when switching fromChain the same as toChain
    //reset toChain
    if (fromChain === toChain) {
      setToChain('')
    } else if (fromChain !== 'Conflux') {
      setToChain('Conflux')
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
            disabled={bothChain}
            cToken={fromChain === 'Conflux'}
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
            cToken={toChain === 'Conflux'}
            disabled={bothChain}
            placeholder={t('placeholder.out')}
          />
        </InputContainer>
      </Row>
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
