import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTrans from './zh/translation.json'
import enTrans from './en/translation.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTrans
      },
      zh: {
        translation: zhTrans,
      },
    },
    lng: 'zh',
    fallbackLng: 'zh',

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
