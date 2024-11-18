export interface Portfolio {
  portfolioId: number;
  portfolioTitle: string;
  portfolioContent: string;
  portfolioJob: number;
  portfolioViews: number;
  portfolioThumbnailImg: string;
  portfolioRecommendationCount: number;
  portfolioDescription: string;
  portfolioPost: boolean;
  portfolioIsPrimary: boolean;
  created: string;
  portfolioCommentCount: number;
  memberId: number;
  memberNickname: string;
  memberUsername: string;
  picture: string;
  isLiked: boolean;
}

export interface PortfolioCommetsResponse {
  portfolioCommentId: number;
  portfolioId: number;
  content: string;
  memberId: number;
  memberUsername: string;
  memberNickname: string;
  memberPicture: string;
  created: string;
}

export interface PortfolioPrimaryResponse {
  portfolioId: number;
  memberId: number;
  portfolioPost: boolean; // 이 값은 필요하지 않을 수도 있음
  portfolioIsPrimary: boolean;
}