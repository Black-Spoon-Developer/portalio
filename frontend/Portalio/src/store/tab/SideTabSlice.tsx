import { createSlice } from "@reduxjs/toolkit";

interface sideTabState {
  tabState: string;
}

const initialState: sideTabState = {
  tabState: "Feed",
};

const sideTabSlice = createSlice({
  name: "sideTab",
  initialState,
  reducers: {
    selectFeed(state) {
      state.tabState = "Feed";
    },

    selectAIinterview(state) {
      state.tabState = "AIinterview";
    },

    selectJobInfo(state) {
      state.tabState = "JobInfo";
    },

    selectMessage(state) {
      state.tabState = "Message";
    },

    selectNotification(state) {
      state.tabState = "Notification";
    },
  },
});

export const sideTabActions = sideTabSlice.actions;
export default sideTabSlice.reducer;
