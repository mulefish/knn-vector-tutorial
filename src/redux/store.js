// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import runHistoryReducer from './runHistory/runHistorySlice';

const store = configureStore({
  reducer: {
    runHistory: runHistoryReducer,
  },
});

export default store;
