import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import styled from 'styled-components'
import TokenInput from '../component/TokenInput/TokenInput'
import Select from '../layout/Select'

export default function Choose() {
  const [choosen, setChoosen] = useState()
  const { t } = useTranslation()
  const { chain } = useParams()
  const options = [
    { value: 'Conflux', key: 'Conflux' },
    { value: t(chain), key: chain },
  ]
  return (
    <div>
      <Row>
        <SelectContainer>
          <SelectChain options={options} {...{ choosen, setChoosen }} />
        </SelectContainer>
        <InputContainer>
          <TokenInput />
        </InputContainer>
      </Row>
      <Row>
        <SelectContainer>
          <SelectChain
            options={options.filter(({ key }) => {
              return key !== choosen
            })}
            disabled={!choosen}
            {...{ choosen, setChoosen }}
          />
        </SelectContainer>
        <InputContainer>
          <TokenInput />
        </InputContainer>
      </Row>
    </div>
  )
}

function SelectChain({ choosen, setChoosen, disabled, options }) {
  const { chain } = useParams()
  const { t } = useTranslation()
  const [current, setCurrent] = useState()

  function render({ title, key }) {
    return <div style={{ color: title ? 'white' : '#333333' }}>{t(key)}</div>
  }
  const setCurrentAndChoosen = (value) => {
    setCurrent(value)
    setChoosen(value)
  }
  return (
    <Select
      disabled={disabled}
      render={render}
      dropdownTitle="cc"
      current={current}
      title={current ? false : 'Choose'}
      setCurrent={setCurrentAndChoosen}
      icon
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
