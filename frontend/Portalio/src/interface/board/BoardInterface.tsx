export interface BoardLikeResponse {
  boardId: number;
  boardCategory: string;
  boardTitle: string;
  boardContent: string;
  boardSolve: boolean;
  boardViews: number;
  boardRecommendationCount: number;
  created: string;
  memberId: number;
  memberNickname: string;
  picture: string;
  isLiked: boolean;
}
