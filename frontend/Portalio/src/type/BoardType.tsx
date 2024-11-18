export interface BoardRequest {
  boardCategory: string;
  boardTitle: string;
  boardContent: string;
  boardSolve: boolean;
  boardThumbnailImg: string;
}

export interface BoardResponse {
  boardId: number;
  boardCategory: string;
  boardTitle: string;
  boardContent: string;
  boardSolve: boolean;
  boardThumbnailImg: string;
  boardViews: number;
  boardRecommendationCount: number;
  created: string
  memberId: number
  memberNickname: string;
  picture: string;
  isLiked: boolean;
}