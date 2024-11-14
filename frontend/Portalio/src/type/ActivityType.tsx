export interface ActivityRequest {
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: string;
}

export interface ActivityResponse {
  activityboardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: string;
  created: string
  repositoryId: number;
  memberId: number
  memberNickname: string;
  picture: string;
}