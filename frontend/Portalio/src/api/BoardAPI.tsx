import axios from "axios";
import store, { RootState } from "../store";

const BASE_URL = "http://localhost:8080";

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
