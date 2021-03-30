import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router'
import styled from 'styled-components'
import Button from '../component/Button/Button'
import Icon from '../component/Icon/Icon'
import PaddingContainer from '../component/PaddingContainer/PaddingContainer'
import TokenInput from '../component/TokenInput/TokenInput'
import { CHAIN_SINGLE_PAIR } from '../config/constant'
import useCaptain from '../data/useCaptainInfo'
import useTokenList from '../data/useTokenList'
import Select from '../layout/Select'
import useUrlSearch from '../lib/useUrlSearch'
import { formatAddress } from '../util/address'
import down from './down.svg'
import left from './left.svg'

export default function AddToken() {
  const { t } = useTranslation(['captain'])
  const { chain } = useParams()
  const history = useHistory()
  const { pair } = useUrlSearch()
  const tokenInfo = useTokenList({ pair: pair || CHAIN_SINGLE_PAIR })

  const [fromChain, setFromChain] = useLocalStorageForChain(
    'addtoken-fromChain',
    tokenInfo ? tokenInfo.origin : '',
    chain
  )
  const [toChain, setToChain] = useLocalStorageForChain(
    'addtoken-toChain',
    tokenInfo ? tokenInfo.to_chain : '',
    chain
  )

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
    <PaddingContainer bottom>
      <TitleContainer>
        <Left
          onClick={() => {
            history.push(`/${chain}/captain`)
          }}
          src={left}
          alt="left"
        ></Left>
        <div>{t('add-token-title')}</div>
      </TitleContainer>
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
      <Down src={down}></Down>
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

      {tokenInfo && <TokenDetails tokenInfo={tokenInfo} t={t} />}
      <Button
        style={{ marginTop: 32 }}
        fullWidth
        disabled={!pair}
        onClick={() => {
          history.push(`/${chain}/captain?pair=${pair}`)
        }}
      >
        Next
      </Button>
    </PaddingContainer>
  )
}

function TokenDetails({ tokenInfo, t }) {
  const { sponsor, minimal_sponsor_amount } = useCaptain(tokenInfo)
  return (
    <DetailRow>
      <Icon txt {...{ ...tokenInfo }}></Icon>
      <DetailRight>
        <First>{formatAddress(sponsor, { chain: 'cfx' })}</First>
        <Second>{`${t('need-mortgage')} ${
          minimal_sponsor_amount + ''
        }`}</Second>
      </DetailRight>
    </DetailRow>
  )
}

function SelectChain({ choosen, setChoosen, disabled, options }) {
  const { t } = useTranslation()

  function render({ title, key }) {
    return <div style={{ color: title ? 'white' : '#333333' }}>{t(key)}</div>
  }

  return (
    <Select
      disabled={disabled}
      render={render}
      dropdownTitle={t('choose-chain')}
      current={choosen}
      title={choosen ? false : 'Choose'}
      setCurrent={setChoosen}
      icon={!disabled}
      options={options}
    />
  )
}

const TitleContainer = styled.div`
  height: 72px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
`
const Left = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 0;
  cursor: pointer;
`

const Row = styled.div`
  display: flex;
  position: relative;
`

const DetailRow = styled(Row)`
  margin-top: 12px;
  justify-content: space-between;
`
const DetailRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const First = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`

const Second = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255);
`
const Down = styled.img`
  display: block;
  margin: auto;
  margin: 12px auto;
`

const SelectContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`
const InputContainer = styled.div`
  flex: 3;
`

function useLocalStorageForChain(localKey, chainFromToken, chain) {
  const [externalSet, setExternalSet] = useState(false)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(localKey)
      return JSON.parse(item)
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
