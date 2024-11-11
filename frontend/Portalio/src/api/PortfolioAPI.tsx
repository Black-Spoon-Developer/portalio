import axios from "axios";
import store, { RootState } from "../store";
import { PortfolioRequest, PortfolioResponse } from "../type/PortfolioType"

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://k11d202.p.ssafy.io";

// public으로 사람들이 올려놓은 포트폴리오 리스트 무한 스크롤 조회
export const fetchMorePosts = async (skip: number, limit: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/portfolios/all`, {
    params: { skip, limit },
  });
  return response.data.items;
};

// public으로 사람들이 올려놓은 포트폴리오 상세 조회
export const fetchPortfolioDetail = async (portfolioID: string) => {
  const portfoliosId = BigInt(portfolioID);

  const response = await axios.get(
    `${BASE_URL}/api/v1/portfolios/${portfoliosId}`
  );

  return response;
};

// public으로 사람들이 올려놓은 포트폴리오 상세 조회 시 댓글 조회
export const fetchPortfolioDetailComments = async (portfolioID: string) => {
  const portfolioId = BigInt(portfolioID);

  const response = await axios.get(
    `${BASE_URL}/api/v1/portfolios/${portfolioId}/comments`
  );

  return response.data.items;
};

// public으로 사람들이 올려놓은 포트폴리오에 대한 댓글 작성
export const postPortfolioDetailComment = async (
  portfolioID: string,
  content: string
) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const portfolioId = BigInt(portfolioID);

  const response = await axios.post(
    `${BASE_URL}/api/v1/portfolios/${portfolioId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.PortfolioCommentResponse;
};

// 포트 폴리오 상세 게시글 좋아요
export const portfolioDetailLike = async (portfolioID: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const portfolioId = BigInt(portfolioID);

  const response = await axios.post(
    `${BASE_URL}/api/v1/portfolios/${portfolioId}/recom`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.PortfolioRecomResponse;
};

// 포트폴리오 검색
export const portfolioSearch = async (
  portfolioTitle: string,
  jobId: number
) => {
  const response = await axios.get(`${BASE_URL}/api/v1/portfolios`, {
    params: {
      portfolioJob: jobId,
      portfolioTitle: portfolioTitle,
    },
  });

  console.log(response.data);

  return response;
};

export const createPortfolio = async (portfolioData: PortfolioRequest): Promise<PortfolioResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.post<PortfolioResponse>(
    `${BASE_URL}/api/v1/portfolios`,
    portfolioData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

export const patchPortfolio = async (portfolioID: string, portfolioData: PortfolioRequest): Promise<PortfolioResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.patch<PortfolioResponse>(
    `${BASE_URL}/api/v1/portfolios/${portfolioID}`,
    portfolioData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}
