export interface UserInfo {
  accessToken: string | null;
  memberId: string | null;
  memberName: string | null;
  memberUsername: string | null;
  memberNickname: string | null;
  memberPicture: string | null;
  memberRole: string | null;
  memberTicket: number | null;
  memberAuth: boolean | null;
  memberJob: string | null;
}

export interface UserDetailInfo {
  memberNickname: string;
  memberJob: string;
}

export interface UserDetailInfoSave {
  memberId: string;
  memberNickname: string;
}
