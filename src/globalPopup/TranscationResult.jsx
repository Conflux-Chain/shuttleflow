import { useTranslation } from 'react-i18next'
import useSWR, { mutate } from 'swr'
import Modal, { Strong } from '../component/Modal'
import { CONFLUXSCAN_TX } from '../config/config'
import fail from './fail.svg'
import sent from './sent.svg'
import Button from '../component/Button/Button'
import styled from 'styled-components'

const TranscationKey = {}
export default function TransactionResult() {
  const { data, mutate } = useSWR(TranscationKey, {
    initialData: {},
  })
  const { successHash, errorReason } = data
  const { t } = useTranslation()
  function close() {
    mutate({}, false)
  }
  return (
    <>
      <Modal show={errorReason} onClose={close} clickAway={close}>
        <Img alt="img" src={fail}></Img>
        <Strong>{t('popup.fail')}</Strong>
        <PopupButton onClick={close}>{t('popup.ok')}</PopupButton>
      </Modal>
      <Modal show={successHash} onClose={close} clickAway={close}>
        <Img alt="img" src={sent}></Img>
        <Strong>{t('popup.sent')}</Strong>
        <PopupButton
          onClick={() => {
            window.open(CONFLUXSCAN_TX + successHash, '_blank')
          }}
        >
          {t('popup.details')}
        </PopupButton>
      </Modal>
    </>
  )
}

export function giveTransactionResult(result, { success, fail, done } = {}) {
  result
    .then((successHash) => {
      if (success) {
        success()
      }
      mutate(TranscationKey, { successHash })
    })
    .catch((errorReason) => {
      if (fail) {
        fail()
      }
      mutate(TranscationKey, { errorReason })
    })
    .finally(() => {
      if (done) {
        done()
      }
    })
}

const Img = styled.img`
  margin: auto;
  display: block;
  width: 192px;
  height: 210px;
`

const PopupButton = styled(Button).attrs({ fullWidth: true })`
  margin-top: 40px;
`
