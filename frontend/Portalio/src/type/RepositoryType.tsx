export interface RepositoryRequest {
  repositoryTitle: string;
  repositoryDescription: string
  repositoryContent: string;
  startDate: string;
  endDate: string;
  repositoryFileKey: string;
  repositoryPost: boolean;
}

export interface RepositoryResponse {
  repositoryId: number;
  repositoryTitle: string;
  repositoryDescription: string
  repositoryContent: string;
  startDate: string;
  endDate: string;
  repositoryFileKey: string;
  repositoryPost: boolean;
  repositoryIsPrimary: boolean;
  memberId: number;
  memberUsername: string;
  picture: string;
}

export interface RepositoryItem {
  items: RepositoryResponse[];
}