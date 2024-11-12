export interface PortfolioRequest {
  portfolioTitle: string;
  portfolioContent: string;
  portfolioThumbnailImg: string;
  portfolioPost: boolean;
  jobSubCategoryId: number | null;
}

export interface PortfolioResponse {
  portfolioId: number;
  portfolioTitle: string;
  portfolioContent: string;
  portfolioJob: number;
  portfolioViews: number;
  portfolioThumbnailImg: string;
  portfolioRecommendationCount: number;
  portfolioPost: boolean;
  created: string;
  memberId: number;
  memberNickname: string;
  picture: string;
  isLiked: Boolean;
}