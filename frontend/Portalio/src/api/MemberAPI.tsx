import axios from "axios";
import { UserDetailInfo } from "../type/UserType";

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

// 회원 닉네임 중복 검사 API
export const memberNicknameDuplicateCheckAPI = async (nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      const response = await axios.get(
        `${BASE_URL}/api/v1/users/duplicate/${nickname}`,
        {
          headers: {
            access: accessToken,
          },
        }
      );

      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

// 개인 회원 세부 정보 저장 API
export const saveUserDetail = async (nickname: string, email: string) => {
  try {
    const accessToken = localStorage.getItem("access");
    const userInfo = localStorage.getItem("userInfo");

    // JSON 문자열로 저장된 userInfo를 객체로 변환
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

    if (accessToken && parsedUserInfo) {
      const request: UserDetailInfo = {
        memberId: parsedUserInfo.memberId,
        nickname,
        email,
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/detail`,
        request,
        {
          headers: { access: accessToken },
        }
      );
      return response;
    }
  } catch (error) {
    console.log(error);

    return null;
  }
};

// 직무 저장 API
export const jobUpdate = async (jobsubcategoryId: number) => {
  try {
    const accessToken = localStorage.getItem("access");
    const memberData = localStorage.getItem("userInfo");
    const parseMemberData = memberData ? JSON.parse(memberData) : null;

    if (accessToken && parseMemberData) {
      const memberId = BigInt(parseMemberData.memberId);

      const response = await axios.post(
        `${BASE_URL}/api/v1/job/save/${memberId}/${jobsubcategoryId}`,
        {},
        { headers: { access: accessToken } }
      );

      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

// 회원 정보 입력 후 인증 처리 API
export const authUser = async () => {
  try {
    const accessToken = localStorage.getItem("access");
    await axios.post(
      `${BASE_URL}/api/v1/users/auth`,
      {},
      {
        headers: {
          access: accessToken,
        },
      }
    );

    return "회원 인증 완료";
  } catch (error) {
    console.log(error);
    alert(error);
  }
};
