export interface JobHistoryResponse {
  jobHistoryId: number;
  jobCompany: string;
  jobPosition: string;
  jobStartDate: string;
  jobEndDate: string;
}

export interface JobHistoryRequest {
  jobCompany: string;
  jobPosition: string;
  jobStartDate: string;
  jobEndDate: string;
}

export interface JobHistoryEditRequest {
  jobHistoryId: number;
  jobCompany: string;
  jobPosition: string;
  jobStartDate: string;
  jobEndDate: string;
}

export interface UserSocialLinkRequest {
  facebook: string;
  instagram: string;
  linkedin: string;
  github: string;
}
