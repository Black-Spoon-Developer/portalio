export interface ActivityList {
  activityBoardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: string;
  activityBoardImageKey: string;
  created: string;
  memberId: number;
  memberUsername: string;
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
  memberUsername: string;
  memberNickname: string;
  picture: string;
}
