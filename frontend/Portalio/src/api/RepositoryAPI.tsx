import axios from "axios";
import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";
<<<<<<< HEAD
import {
  RepositoryItem,
  RepositoryRequest,
  RepositoryResponse,
} from "../type/RepositoryType";
=======
import { RepositoryItem, RepositoryRequest, RepositoryResponse } from "../type/RepositoryType"


>>>>>>> 28819a1dc49b3c259646ea3b5974dd39e67315cc

// 레포지토리 글쓰기
export const createRepository = async (
  repositoryData: RepositoryRequest
): Promise<RepositoryResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.post<RepositoryResponse>(
    `${BASE_URL}/api/v1/repository`,
    repositoryData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// 레포지토리 글 수정
export const patchRepository = async (
  repositoryID: string,
  repositoryData: RepositoryRequest
): Promise<RepositoryResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.patch<RepositoryResponse>(
    `${BASE_URL}/api/v1/repository/${repositoryID}`,
    repositoryData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// 레포지토리 글 상세보기
<<<<<<< HEAD
export const getRepositoryDetail = async (repositoryId: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  console.log(repositoryId)
  const response = await axios.get(
    `${BASE_URL}/api/v1/repository/${repositoryId}/detail`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
=======
export const getRepositoryDetail = async (repositoryID: string) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/repository/${repositoryID}/detail`
>>>>>>> 28819a1dc49b3c259646ea3b5974dd39e67315cc
  );

  return response;
};

// 내 레포지토리 전체보기
<<<<<<< HEAD
export const getMyRepositoryList = async (
  username: string
): Promise<RepositoryItem> => {
=======
export const getMyRepositoryList = async (username: string): Promise<RepositoryItem> => {
>>>>>>> 28819a1dc49b3c259646ea3b5974dd39e67315cc
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.get<RepositoryItem>(
    `${BASE_URL}/api/v1/repository/${username}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// 레포지토리 조회하기
export const getRepository = async (repositoryId: number) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.get(
    `${BASE_URL}/api/v1/repository/${repositoryId}/detail`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
<<<<<<< HEAD
  console.log("API Response:", response.status, response.data);
=======
>>>>>>> 28819a1dc49b3c259646ea3b5974dd39e67315cc

  return response.data;
};
