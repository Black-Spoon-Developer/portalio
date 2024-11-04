import axios from "axios";

const BASE_URL = "http://localhost:8080";

// access 토큰으로 회원 정보 요청 API
export const userTokenFetchAPI = async () => {
  try {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      const response = await axios.get(`${BASE_URL}/api/v1/users/info`, {
        headers: {
          access: accessToken,
        },
      });

      return response;
    }
  } catch (error) {
    console.log(error);
  }
};
