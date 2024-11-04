import axios from "axios";

const BASE_URL = "http://localhost:8080";

// 엑세스 토큰 발급 요청 API
export const issueAccessToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/users/token/issue`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.access;
    console.log(newAccessToken); // access 토큰 확인
    return newAccessToken; // 필요에 따라 반환
  } catch (error) {
    console.error("Failed to issue access token:", error);
    return null; // 오류 시 null 반환
  }
};

// 로그아웃 API
export const logoutApi = async () => {
  try {
    // access 토큰 조회
    const accessToken = localStorage.getItem("access");

    // refreshToken 삭제 요청
    axios.post(
      `${BASE_URL}/api/v1/users/logout`,
      {},
      {
        headers: {
          access: accessToken,
        },
      }
    );

    // localStorage에서 accessToken 및 userInfo 삭제
    localStorage.removeItem("access");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("isLogin");
    localStorage.setItem("isLogin", "false");
  } catch (error) {
    console.log(error);
  }
};
