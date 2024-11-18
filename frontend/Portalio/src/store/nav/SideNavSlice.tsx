import { createSlice } from "@reduxjs/toolkit";

interface sideTabState {
  tabState: string;
}

const initialState: sideTabState = {
  tabState: "Feed",
};

const sideNavSlice = createSlice({
  name: "sideNav",
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

    selectMypage(state) {
      state.tabState = "MyPage";
    },
  },
});

export const sideNavActions = sideNavSlice.actions;
export default sideNavSlice.reducer;
