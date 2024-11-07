import { createSlice } from "@reduxjs/toolkit";

const portFolioSlice = createSlice({
  name: "portfolio",
  initialState: {},
  reducers: {},
});

export const portFolioActions = portFolioSlice.actions;

export default portFolioSlice.reducer;
