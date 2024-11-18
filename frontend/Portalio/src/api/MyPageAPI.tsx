import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";
import {
  JobHistoryRequest,
  UserSocialLinkRequest,
  JobHistoryEditRequest,
} from "../interface/mypage/MyPageInterface";
import axios from "axios";

// 경력/이력 조회
export const getjobHistory = async (memberId: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/jobHistory/${memberId}`);

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
export const getSocialLink = async (memberId: number) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/users/social/${memberId}`
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