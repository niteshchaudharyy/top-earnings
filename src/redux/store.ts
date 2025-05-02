import { configureStore } from '@reduxjs/toolkit'
import earningsReducer from './slices/earningSlice'


const store = configureStore({
  reducer: {
    earnings: earningsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;