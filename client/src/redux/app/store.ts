import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice'
import notesReducer from '../features/noteSlice'
import personalTaskSlice from '../features/personalSlice'
const store = configureStore({
  reducer: {
    auth: authSlice,
    notes: notesReducer,
    trello:personalTaskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;