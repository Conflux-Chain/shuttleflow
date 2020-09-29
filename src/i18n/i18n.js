import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTrans from './zh/translation.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          'Welcome to React': 'Welcome to React and react-i18next',
        },
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
