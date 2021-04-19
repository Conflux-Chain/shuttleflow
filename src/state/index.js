import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import transactions from './transactions/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS = ['transactions']

const store = configureStore({
  reducer: {
    application,
    transactions,
    multicall,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

export default store
