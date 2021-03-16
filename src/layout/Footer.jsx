import { useTranslation, Trans } from 'react-i18next'
import styled from 'styled-components'
import whitePaperEN from './SF-whitepaper-en.pdf'
import whitePaperZH from './SF-whitepaper-zh.pdf'
import Modal, { modalStyles } from '../component/Modal'
import styles from './Spec.module.scss'
import useStyle from '../component/useStyle'
import { useState } from 'react'

console.log(whitePaperEN)
export default function Footer() {
  const { t, i18n } = useTranslation()
  const [displayPopup, setDisplayPopup] = useState(false)
  const { language } = i18n
  const [cx, modalCx] = useStyle(styles, modalStyles)
  return (
    <>
      <Container>
        <CopyRight>© 2021 ShuttleFlow. All Rights Reserved.</CopyRight>
        <Right>
          <RightItem
            href={language === 'zh' ? whitePaperZH : whitePaperEN}
            target="_blank"
          >
            {t('footer.whitepaper')}
          </RightItem>
          <RightItem>{t('footer.doc')}</RightItem>
          <RightItem onClick={() => setDisplayPopup(true)}>
            {t('footer.spec')}
          </RightItem>
          <RightItem>{t('footer.faq')}</RightItem>
        </Right>
      </Container>
      <Modal
        clickAway={() => setDisplayPopup(false)}
        onClose={() => setDisplayPopup(false)}
        show={displayPopup}
        title={t('spec.title')}
      >
        <div className={modalCx('content')}>
          <Trans i18nKey="spec.content" t={t}></Trans>
        </div>
        <div onClick={() => setDisplayPopup(false)} className={modalCx('btn')}>
          {t('popup.ok')}
        </div>
      </Modal>
    </>
  )
}

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  height: 64px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0 2rem;
`
const CopyRight = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  display: flex;
  align-items: center;
`

const Right = styled.div`
  display: flex;
  align-items: center;
`
const RightItem = styled.a`
  color: #ffffff;
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
  &::visited {
    color: #ffffff;
  }
`
