import axios from "axios";
import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";

// 엑세스 토큰 발급 요청 API
export const issueAccessToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/users/token/issue`,
      {},
      { withCredentials: true }
    );

    return response; // 필요에 따라 반환
  } catch (error) {
    console.error("Failed to issue access token:", error);
    return null; // 오류 시 null 반환
  }
};

// 로그아웃 API
export const logoutApi = async () => {
  try {
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;

    localStorage.setItem("isLogin", "false");

    // refreshToken 삭제 요청
    axios.post(
      `${BASE_URL}/api/v1/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};
