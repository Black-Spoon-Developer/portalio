import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";
import {
  JobHistoryRequest,
  UserSocialLinkRequest,
  JobHistoryEditRequest,
} from "../interface/mypage/MyPageInterface";
import axios from "axios";

// 경력/이력 조회
export const getjobHistory = async (username: string) => {
  const response = await axios.get(`${BASE_URL}/api/v1/jobHistory/${username}`);

  return response.data.items;
};

// 경력/이력 생성
export const createJobHistory = async (request: JobHistoryRequest) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.post(
    `${BASE_URL}/api/v1/jobHistory/save`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// 경력/이력 수정
export const editJobHistory = async (request: JobHistoryEditRequest) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.patch(
    `${BASE_URL}/api/v1/jobHistory/edit`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// 경력/이력 삭제
export const deleteJobHistory = async (jobHistoryId: number) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.delete(
    `${BASE_URL}/api/v1/jobHistory/delete/${jobHistoryId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// 소셜 링크 조회
export const getSocialLink = async (username: string) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/users/social/${username}`
  );

  return response.data;
};

// 소셜 링크 생성 및 업데이트
export const createOrUpdateSocialLink = async (
  request: UserSocialLinkRequest
) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.patch(
    `${BASE_URL}/api/v1/users/social/saveOrEdit`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// 회원 자기소개 조회
export const getUserIntroduction = async (username: string) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/users/introduction/${username}`
  );

  return response.data;
};

// 회원 자기소개 저장 및 수정
export const setUserIntroduction = async (introduction: {
  userIntroductionTitle: string;
  userIntroductionContent: string;
}) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.patch(
    `${BASE_URL}/api/v1/users/introduction/saveOrEdit`,
    introduction, // 요청 데이터로 전달
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data; // 성공 시 반환된 데이터
};