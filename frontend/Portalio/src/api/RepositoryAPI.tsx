import axios from "axios";
import store, { RootState } from "../store";
import { RepositoryRequest, RepositoryResponse } from "../type/RepositoryType";

const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://k11d202.p.ssafy.io";

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
export const getRepositoryDetail = async (repositoryID: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.get(
    `${BASE_URL}/api/v1/repository/${repositoryID}/detail`
  );

  return response;
};
