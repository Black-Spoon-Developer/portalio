export interface PortfolioRequest {
  portfolioTitle: string;
  portfolioContent: string;
  portfolioImgKey?: string;
  portfolioFileKey?: string;
  portfolioThumbnailImg?: string;
  jobSubCategoryId?: number;
}

export interface PortfolioResponse {
  portfolioId: number;
  portfolioTitle: string;
  portfolioContent: string;
  portfolioJob: number;
  portfolioImgKey?: string;
  portfolioFileKey?: string;
  portfolioViews: number;
  portfolioThumbnailImg: string;
  portfolioRecommendationCount: number;
  portfolioPost: boolean;
  created: string;
  memberId: number;
}
