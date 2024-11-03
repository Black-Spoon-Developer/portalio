import axios from "axios";

// 네이버 로그인 요청
export const naverLogin = async () => {
  try {
    const response = await axios.get("http://localhost:8080/my", {
      withCredentials: true,
    });
    alert(JSON.stringify(response.data));
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
