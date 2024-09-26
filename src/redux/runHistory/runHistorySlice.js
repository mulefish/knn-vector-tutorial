import { createSlice } from '@reduxjs/toolkit';

const runHistorySlice = createSlice({
  name: 'runHistory',
  initialState: {
    history: [],
  },
  reducers: {
    addRun: (state, action) => {
      state.history.push(action.payload);
    },
    resetHistory: (state) => {
      state.history = [];
    },
  },
});

export const { addRun, resetHistory } = runHistorySlice.actions;
export default runHistorySlice.reducer;
