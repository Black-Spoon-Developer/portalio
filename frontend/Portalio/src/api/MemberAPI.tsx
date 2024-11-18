import axios from "axios";
import { UserDetailInfoSave } from "../type/UserType";
import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";

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
      const request: UserDetailInfoSave = {
        memberId,
        memberNickname: nickname,
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

// 프로필 사진 업데이트 함수
export const updateProfilePicture = async (imageUrl: string) => {
  try {
    // Redux
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;
    const memberId = state.auth.memberId;

    if (accessToken && memberId) {
      const request = {
        memberPicture: imageUrl,
      };

      const response = await axios.post(
        `${BASE_URL}/api/v1/users/${memberId}/picture`,
        request,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
          },
        }
      );
      return response;
    }
  } catch (error) {
    console.log("프로필 사진 업데이트 오류: ", error);
  }
};

// 프로필 사진 조회 함수
export const getProfilePicture = async (username: string) => {
  try {
    // Redux
    const state: RootState = store.getState();
    const accessToken = state.auth.accessToken;

    if (accessToken && username) {
      const response = await axios.get(
        `${BASE_URL}/api/v1/users/${username}/picture`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.log("프로필 사진 조회중 오류: ", error);
  }
};