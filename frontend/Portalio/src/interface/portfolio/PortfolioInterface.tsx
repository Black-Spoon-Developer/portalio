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
  picture: string;
  isLiked: boolean;
}

export interface PortfolioCommetsResponse {
  portfolioCommentId: number;
  portfolioId: number;
  content: string;
  memberId: number;
  memberNickname: string;
  memberPicture: string;
  created: string;
}
