import axios from "axios";
import store, { RootState } from "../store";
import { PortfolioRequest, PortfolioResponse } from "../type/PortfolioType";
import { BASE_URL } from "./BaseVariable";
import { PortfolioPrimaryResponse } from "./../interface/portfolio/PortfolioInterface";

// public으로 사람들이 올려놓은 포트폴리오 리스트 무한 스크롤 조회
export const fetchMorePosts = async (skip: number, limit: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/portfolios/all`, {
    params: { skip, limit },
  });
  return response.data.items;
};

// public으로 사람들이 올려놓은 포트폴리오 상세 조회
export const fetchPortfolioDetail = async (portfolioID: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const portfoliosId = BigInt(portfolioID);

  const response = await axios.get(
    `${BASE_URL}/api/v1/portfolios/${portfoliosId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
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

  const portfoliosId = BigInt(portfolioID);

  const response = await axios.post(
    `${BASE_URL}/api/v1/portfolios/${portfoliosId}/recom`,
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

  return response.data.items;
};

export const createPortfolio = async (
  portfolioData: PortfolioRequest
): Promise<PortfolioResponse> => {
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
};

export const patchPortfolio = async (
  portfolioID: string,
  portfolioData: PortfolioRequest
): Promise<PortfolioResponse> => {
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
};

// 내가 쓴 포트폴리오 리스트 조회
export const getMyPortfolios = async (
  username: string,
  skip: number,
  limit: number
) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/portfolios/my/${username}`,
    {
      params: {
        skip,
        limit,
      },
    }
  );
  return response;
};

// 대표 포트폴리오 설정하기
export const setPrimaryPortfolio = async (
  portfolio_id: number
): Promise<PortfolioPrimaryResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.patch(
    `${BASE_URL}/api/v1/portfolios/${portfolio_id}/primary`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const getTop10Portfolios = async () => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/portfolios/popular/top10`
  );
  return response.data;
};
