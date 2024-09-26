// src/redux/runHistory/runHistorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  runHistory: [],
};

const runHistorySlice = createSlice({
  name: 'runHistory',
  initialState,
  reducers: {
    addRun: (state, action) => {
      state.runHistory.push(action.payload);
    },
    resetRunHistory: (state) => {
      state.runHistory = [];
    },
  },
});

export const { addRun, resetRunHistory } = runHistorySlice.actions;
export default runHistorySlice.reducer;
