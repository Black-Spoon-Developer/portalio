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
  repositoryContent: string;
  startDate: string;
  endDate: string;
  repositoryFileKey: string;
  repositoryPost: boolean;
  memberId: number;
}