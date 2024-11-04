import axios from "axios";

// 구글 로그인
export const googleLoginApi = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/oauth2/authorization/google",
      {
        withCredentials: true, // 쿠키를 포함해서 요청을 보냄
      }
    );

    // 응답 헤더에서 access 토큰을 가져와 localStorage에 저장
    const accessToken = response.headers["access"];
    if (accessToken) {
      localStorage.setItem("access", accessToken);
    }
  } catch (error) {
    console.error("로그인 실패:", error);
  }
};

export const naverLoginApi = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/oauth2/authorization/naver",
      {
        withCredentials: true, // 쿠키를 포함해서 요청을 보냄
      }
    );

    // 응답 헤더에서 access 토큰을 가져와 localStorage에 저장
    const accessToken = response.headers["access"];
    if (accessToken) {
      localStorage.setItem("access", accessToken);
    }
  } catch (error) {
    console.error("로그인 실패:", error);
  }
};

// 토큰을 이용한 회원 정보 조회 API
export const fetchUserInfo = async () => {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) return;

  try {
    const response = await axios.get(
      "http://localhost:8080/api/v1/users/info",
      {
        headers: {
          access: accessToken,
        },
      }
    );

    // 회원 정보를 localStorage에 저장
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  } catch (error) {
    console.error("회원 정보를 가져오는 데 실패했습니다.", error);
  }
};
