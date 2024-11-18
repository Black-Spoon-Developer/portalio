export interface TextAnswerRequest {
  interview_id: number;
  question_id: number;
  portfolio_id: number;
  repository_id: number;
  answer_text: string;
}

// 인터뷰 전반에 대한 인터페이스
export interface TextInterviewResult {
  interview_id: number;
  interview_type: string;
  created_at: string;
  questions: Question[];
  interview_grade: string;
}

// 질문에 대한 인터페이스
export interface Question {
  content: string;
  intent: string;
  tag: string;
  answers: Answer[];
}

// 답변에 대한 인터페이스
export interface Answer {
  content: string;
  feedback: Feedback;
}

// 피드백에 대한 인터페이스
export interface Feedback {
  scores: Scores;
  strengths: Strength[];
  improvements: Improvement[];
  overall_feedback: OverallFeedback;
}

// 점수에 대한 인터페이스
export interface Scores {
  overall: number;
  [key: string]: number;
}

// 강점에 대한 인터페이스
export interface Strength {
  point: string;
  details: string;
  example: string;
}

// 개선점에 대한 인터페이스
export interface Improvement {
  point: string;
  example: string;
  priority: number;
  suggestion: string;
}

// 전반적인 피드백에 대한 인터페이스
export interface OverallFeedback {
  summary: string;
  next_steps: string[];
  key_improvement: string;
}
