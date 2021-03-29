import { useTranslation } from 'react-i18next'
import useSWR, { mutate } from 'swr'
import Modal from '../component/Modal'
import { CONFLUXSCAN_TX } from '../config/config'
import fail from './fail.svg'
import sent from './sent.svg'

const TranscationKey = {}
export default function TransactionResult() {
  const { data, mutate } = useSWR(TranscationKey, { initialData: {} })
  const { successHash, errorReason } = data
  const { t } = useTranslation()
  function close() {
    mutate({}, false)
  }
  return (
    <>
      <Modal show={errorReason} onClose={close} clickAway={close}>
        <img alt="img" src={fail}></img>
        <div>{t('popup.fail')}</div>
        <div onClick={close}>{t('popup.ok')}</div>
      </Modal>
      <Modal show={successHash} onClose={close} clickAway={close}>
        <img alt="img" src={sent}></img>
        <div>{t('popup.sent')}</div>
        <div
          onClick={() => {
            close()
            if (onCloseSuccess) {
              onCloseSuccess()
            }
            window.open(CONFLUXSCAN_TX + successHash, '_blank')
          }}
        >
          {t('popup.details')}
        </div>
      </Modal>
    </>
  )
}

export function giveTransactionResult(result, done) {
  result
    .then((successHash) => {
      mutate(TranscationKey, { successHash })
    })
    .catch((errorReason) => {
      mutate(TranscationKey, { errorReason })
    })
    .finally(() => {
      if (done) {
        done()
      }
    })
}
