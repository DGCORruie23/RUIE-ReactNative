import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userDataSlice } from './Slices'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const reducer = combineReducers({
  userData: userDataSlice,
})

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        warnAfter: 128,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
