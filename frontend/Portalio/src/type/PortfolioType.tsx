export interface PortfolioRequest {
  portfolioTitle: string;
  portfolioDescription: string
  portfolioContent: string;
  portfolioThumbnailImg: string;
  portfolioPost: boolean;
  jobSubCategoryId: number | null;
}

export interface PortfolioResponse {
  portfolioId: number;
  portfolioTitle: string;
  portfolioDescription: string
  portfolioContent: string;
  portfolioJob: number;
  portfolioViews: number;
  portfolioThumbnailImg: string;
  portfolioRecommendationCount: number;
  portfolioPost: boolean;
  portfolioIsPrimary: boolean;
  created: string;
  portfolioCommentCount: number,
  memberId: number;
  memberNickname: string;
  picture: string;
  isLiked: Boolean;
}