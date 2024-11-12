import axios from "axios";
import { UserDetailInfo } from "../type/UserType";
import store, { RootState } from "../store";

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "https://k11d202.p.ssafy.io";

// 회원 닉네임 중복 검사 API
export const memberNicknameDuplicateCheckAPI = async (nickname: string) => {
  try {
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken) {
      const response = await axios.get(
        `${BASE_URL}/api/v1/users/duplicate/${nickname}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
export const saveUserDetail = async (nickname: string) => {
  try {
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;
    const memberId = state.auth.memberId;

    if (accessToken && memberId) {
      const request: UserDetailInfo = {
        memberId,
        nickname,
      };

      const response = await axios.patch(
        `${BASE_URL}/api/v1/users/nickname`,
        request,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
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
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;
    const memberId = state.auth.memberId;

    if (accessToken && memberId) {
      const parseMemberId = BigInt(memberId);

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/job/save/${parseMemberId}/${jobsubcategoryId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
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
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;

    await axios.post(
      `${BASE_URL}/api/v1/users/auth`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return "회원 인증 완료";
  } catch (error) {
    console.log(error);
    alert(error);
  }
};
