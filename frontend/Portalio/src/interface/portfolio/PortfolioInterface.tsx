export interface Portfolio {
  id: number;
  memberId: number;
  authorNickname: string;
  authorPicture: string;
  portfolioTitle: string;
  portfolioContent: string;
  portfolioCommentCount: number;
  portfolioRecommendationCount: number;
  time: string;
  created: string;
}

export interface PortfolioList {
  portfolioId: number;
  authorInfo: object;
  time: string;
  portfolioThumbnailImg: string;
  portfolioContent: string;
  portfolioCommentCount: number;
  portfolioRecommendationCount: number;
  created: string;
}