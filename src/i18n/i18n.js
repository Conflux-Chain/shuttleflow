import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhShuttleIn from './zh/shuttle-in.json'
import zhShuttleOut from './zh/shuttle-out.json'
import zhCommon from './zh/common.json'
import zhTrans from './zh/translation.json'
//market and translation
import zhMHTrans from './zh/history-market.json'

import enShuttleIn from './en/shuttle-in.json'
import enShuttleOut from './en/shuttle-out.json'
import enCommon from './en/common.json'
import enTrans from './en/translation.json'
import enMHTrans from './en/history-market.json'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        'shuttle-in': enShuttleIn,
        'shuttle-out': enShuttleOut,
        common: enCommon,
        market: enMHTrans,
        history: enMHTrans,
        translation: enTrans,
      },
      zh: {
        'shuttle-in': zhShuttleIn,
        'shuttle-out': zhShuttleOut,
        common: zhCommon,
        market: zhMHTrans,
        history: zhMHTrans,
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
