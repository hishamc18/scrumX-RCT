import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../features/authSlice'
import notesReducer from '../features/noteSlice'
import aiSlice from "../features/aiSlice"
import projectReducer from '../features/projectSlice'
import trelloPersonal from "../features/personalSlice"

const store = configureStore({
  reducer: {
    auth: authSlice,
    notes: notesReducer,
    aichat: aiSlice,
    project: projectReducer,
    trello: trelloPersonal
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;