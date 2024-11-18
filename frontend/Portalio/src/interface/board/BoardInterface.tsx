export interface BoardLikeResponse {
  boardId: number;
  boardCategory: string;
  boardTitle: string;
  boardContent: string;
  boardSolve: boolean;
  boardViews: number;
  boardRecommendationCount: number;
  boardCommentCount: number;
  created: string;
  memberId: number;
  memberUsername: string;
  memberNickname: string;
  picture: string;
  isLiked: boolean;
}

// 댓글 목록 불러오는 인터페이스
export interface BoardCommentsResponse {
  commentId: number;
  content: string;
  boardId: number;
  memberId: number;
  memberUsername: string;
  memberNickname: string;
  picture: string;
  created: string;
}
