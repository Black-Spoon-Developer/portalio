export interface InterViewState {
  isRecording: boolean;
  audioUrl: string | null;
  response: any | null;
  isLoading: boolean;
  questionId: number | null;
  interviewId: number | null;
  portfolioId: number | null;
  repositoryId: number | null;
  questions: QuestionDTO[]; // 질문 리스트 추가
  currentIndex: number;
}

// 질문 생성 관련 타입
export interface QuestionRequestDTO {
  portfolio_id?: number;
  repository_id?: number;
  job_roles: string[];
}

export interface QuestionDTO {
  question_id: number;
  question_text: string;
}

export interface QuestionResponseDTO {
  interview_id: number;
  portfolio_id?: number;
  repository_id?: number;
  questions: QuestionDTO[];
}

export interface AnswerRequest {
  question_id: number;
  interview_id: number;
  portfolio_id?: number;
  repository_id?: number;
}

export interface AnswerResponseDTO {
  answer_id: number;
  feedback: string;
  feedback_json: any;
}

// 질문 생성 요청 데이터 타입 정의
export interface GenerateQuestionsRequest {
  portfolio_id?: number;
  repository_id?: number;
  job_roles: string[];
}

// 질문 생성 응답 데이터 타입 정의
export interface GenerateQuestionsResponse {
  interview_id: number;
  portfolio_id: number | null;
  repository_id: number | null;
  questions: QuestionDTO[];
}

export interface MemberJobDTO {
  job_id: number;
  job_name: string;
}

export interface PortfolioDTO {
  portfolio_id: number;
  portfolio_title: string;
  portfolio_description: string | null;
  portfolio_is_primary: boolean;
}

export interface RepositoryDTO {
  repository_id: number;
  repository_title: string;
  repository_description: string | null;
  repository_is_primary: boolean;
}

export interface MemberInfoDTO {
  member_id: number;
  portfolios: PortfolioDTO[];
  repositories: RepositoryDTO[];
  hope_jobs: MemberJobDTO[];
}
