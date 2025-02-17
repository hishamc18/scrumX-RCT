import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice'
import notesReducer from '../features/noteSlice'
import projectReducer from '../features/projectSlice'


const store = configureStore({
  reducer: {
    auth: authSlice,
    notes: notesReducer,
    project:projectReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;