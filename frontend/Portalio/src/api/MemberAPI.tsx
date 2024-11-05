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

// 회원 닉네임 중복 검사 API
export const memberNicknameDuplicateCheckAPI = async (nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      const response = await axios.get(
        `${BASE_URL}/api/v1/users/duplicate/nickname/${nickname}`,
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

// 개인 회원 닉네임 설정 및 수정
export const saveMemberNickname = async (nickname: string) => {
  try {
    const accessToken = localStorage.getItem("access");
    const userInfo = JSON.stringify(localStorage.getItem("userInfo"));
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

    if (accessToken && parsedUserInfo) {
      const email = parsedUserInfo.memberEmail;

      const response = await axios.put(
        `${BASE_URL}/api/v1/users/${email}/nickname/${nickname}`,
        {},
        {
          headers: { access: accessToken },
        }
      );
      return response;
    }
  } catch (error) {
    console.log(error);
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
