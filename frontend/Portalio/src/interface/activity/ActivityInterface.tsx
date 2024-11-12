export interface ActivityList {
  activityBoardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: string;
  activityBoardImageKey: string;
  created: string;
  memberId: number;
  memberNickname: string;
  picture: string;
  repositoryId: number;
}

export interface ActivityDetail {
  activityBoardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: string;
  activityBoardImageKey: string;
  created: string;
  repositoryId: number;
  memberId: number;
  memberNickname: string;
  picture: string;
}
