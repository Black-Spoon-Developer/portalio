import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../type/UserType";

const initialState: UserInfo = {
  accessToken: null,
  memberId: null,
  memberName: null,
  memberUsername: null,
  memberNickname: null,
  memberPicture: null,
  memberRole: null,
  memberTicket: null,
  memberAuth: null,
  memberJob: null,
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
      state.memberName = action.payload.memberName;
      state.memberNickname = action.payload.memberNickname;
      state.memberUsername = action.payload.memberUsername;
      state.memberPicture = action.payload.memberPicture;
      state.memberRole = action.payload.memberRole;
      state.memberTicket = action.payload.memberTicket;
      state.memberAuth = action.payload.memberAuth;
      state.memberJob = action.payload.memberJob;
    },

    logout(state) {
      state.accessToken = null;
      state.memberId = null;
      state.memberName = null;
      state.memberUsername = null;
      state.memberPicture = null;
      state.memberRole = null;
      state.memberAuth = null;
      state.memberJob = null;
      state.memberNickname = null;
      state.memberTicket = null;
    },

    // 회원 정보 입력 시 정보 저장 - 닉네임, 직무
    setUserInfo(state, action) {
      state.memberNickname = action.payload.memberNickname;
      state.memberJob = action.payload.memberJob;
    },

    // 회원 정보 입력 성공 시 memberAuth 값 변경
    successMemberAuth(state) {
      state.memberAuth = true;
    },

    // 티켓 로직 - 티켓 증감시 서버에서 오는 티켓 수를 저장하기
    updateTicket(state, action) {
      state.memberTicket = action.payload;
    },

    updateMemberPicture(state, action) {
      state.memberPicture = action.payload; // 업데이트된 프로필 이미지 URL 설정
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
