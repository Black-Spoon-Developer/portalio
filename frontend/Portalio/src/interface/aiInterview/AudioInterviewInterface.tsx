export interface AudioInterviewResult {
  interview_id: number;
  interview_type: string;
  created_at: string;
  questions: Question[];
}

export interface Question {
  content: string;
  intent: string;
  tag: string;
  answers: Answer[];
}

interface Answer {
  content: string;
  audio_url: string;
  feedback: Feedback;
  analysis: Analysis;
}

interface Feedback {
  scores: Scores;
  strengths: Strength[];
  improvements: Improvement[];
  overall_feedback: OverallFeedback;
}

interface Scores {
  overall: number;
  growth_potential: number;
  job_understanding: number;
  practical_ability: number;
  [key: string]: number; // 유동적인 점수 키를 추가로 처리
}

interface Strength {
  point: string;
  details: string;
  example: string;
}

interface Improvement {
  point: string;
  example: string;
  priority: number;
  suggestion: string;
}

interface OverallFeedback {
  summary: string;
  next_steps: string[];
  key_improvement: string;
}

interface Analysis {
  transcript: string;
  speech_metrics: SpeechMetrics;
  pronunciation_analysis: PronunciationAnalysis;
}

interface SpeechMetrics {
  speech_rate: number;
  volume_variation: number;
  silence_ratio: number;
  fluency_score: number;
}

interface PronunciationAnalysis {
  expert_advice: string[];
  key_issues_count: number;
  speaking_pattern: SpeakingPattern;
}

interface SpeakingPattern {
  seperation_speed: string; // 이전 '전반적 속도'
  point: string[] | null; // 이전 '특징'
}

export interface AudioAnswerRequest {
  question_id: number;
  interview_id: number;
  portfolio_id?: number;
  repository_id?: number;
}
