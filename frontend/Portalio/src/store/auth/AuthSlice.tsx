import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../type/UserType";

const initialState: UserInfo = {
  accessToken: null,
  memberId: null,
  name: null,
  username: null,
  picture: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 여기서 state는 initialState의 값을 지칭
    // action은 parameter로 넣어서 전달한 값
    login(state, action) {
      state.accessToken = action.payload.accessToken;
      state.memberId = action.payload.memberId;
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.picture = action.payload.picture;
      state.role = action.payload.role;
    },
    logout(state) {
      state.accessToken = null;
      state.memberId = null;
      state.name = null;
      state.username = null;
      state.picture = null;
      state.role = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
