import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhShuttleIn from './zh/shuttle-in.json'
import zhShuttleOut from './zh/shuttle-out.json'
import zhCommon from './zh/common.json'

import zhTrans from './zh/translation.json'
import enTrans from './en/translation.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTrans,
      },
      zh: {
        translation: zhTrans,
        'shuttle-in': zhShuttleIn,
        'shuttle-out': zhShuttleOut,
        common: zhCommon,
      },
    },
    lng: 'zh',
    fallbackLng: 'zh',

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
