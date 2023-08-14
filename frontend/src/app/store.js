import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthReducer from '../features/auth/authSlice';
import MeetingReducer from '../features/meeting/meetingSlice';
import PagesReducer from '../features/pages/pagesSlice/pagesSlice';

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  // 리듀서 합
  auth: AuthReducer,
  meeting: MeetingReducer,
  pages: PagesReducer,
});
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // 리듀서 연결
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default function configStore() {
  const persistor = persistStore(store);
  return { store, persistor };
}
