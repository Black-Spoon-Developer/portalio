import axios from "axios";
import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";

import { RepositoryItem, RepositoryRequest, RepositoryResponse } from "../type/RepositoryType"



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
export const getRepositoryDetail = async (repositoryId: number) => {
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
  )

  return response.data;
}

// 내 레포지토리 전체보기
export const getMyRepositoryList = async (username: string): Promise<RepositoryItem> => {
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
  console.log("API Response:", response.status, response.data);
  return response.data;
};

// 레포지토리 글 삭제
export const deleteRepository = async (repositoryId: number): Promise<void> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  
  const response = await axios.delete(
    `${BASE_URL}/api/v1/repository/${repositoryId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  return response.data;
};
