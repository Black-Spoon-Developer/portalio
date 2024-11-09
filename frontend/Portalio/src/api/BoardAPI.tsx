import axios from "axios";

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
  console.log(response);
  return response.data.PortfolioResponse;
};

export const fetchPortfolioDetailComments = async (portfolioId: number) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/portfolios/${portfolioId}/comments`
  );

  return response.data.items;
};
