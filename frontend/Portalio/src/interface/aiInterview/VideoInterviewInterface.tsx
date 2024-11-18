export interface VideoAnswerRequest {
  question_id: number;
  interview_id: number;
  portfolio_id?: number;
  repository_id?: number;
}

// 여기에 작성하기
export interface VideoInterviewResult {
  interview_id: number;
  interview_type: string;
  created_at: string;
  questions: Question[];
  interview_grade: string;
}

export interface Question {
  content: string;
  intent: string;
  tag: string;
  answers: Answer[];
}

export interface Answer {
  content: string;
  video_url: string;
  audio_url: string;
  feedback: Feedback;
  analysis: Analysis;
}

export interface Feedback {
  scores: Scores;
  strengths: Strength[];
  improvements: Improvement[];
  overall_feedback: OverallFeedback;
}

export interface Scores {
  [key: string]: number;
}

export interface Strength {
  point: string;
  details: string;
  example: string;
}

export interface Improvement {
  point: string;
  example: string;
  priority: number;
  suggestion: string;
}

export interface OverallFeedback {
  summary: string;
  next_steps: string[];
  key_improvement: string;
}

export interface Analysis {
  transcript: string;
  video_metrics: VideoMetrics;
  speech_metrics: SpeechMetrics;
  pronunciation_analysis: PronunciationAnalysis;
}

export interface VideoMetrics {
  metrics: VideoMetricsDetails;
  expert_analysis: ExpertAnalysis;
  time_series: string[];
}

export interface VideoMetricsDetails {
  gaze: MetricDetails;
  movement: MetricDetails;
  emotion: EmotionDetails;
}

export interface MetricDetails {
  average: number;
  stability: number;
  pattern: string;
  baseline_comparison: number;
}

export interface EmotionDetails {
  dominant: string;
  changes: number;
  pattern: string;
  matches_baseline: boolean;
}

export interface ExpertAnalysis {
  gaze_feedback: string;
  movement_feedback: string;
  emotion_feedback: string;
  improvement_suggestions: string;
}

export interface SpeechMetrics {
  speech_rate: number;
  volume_variation: number;
  silence_ratio: number;
  fluency_score: number;
}

export interface PronunciationAnalysis {
  expert_advice: string[];
  key_issues_count: number;
  speaking_pattern: SpeakingPattern;
}

export interface SpeakingPattern {
  seperation_speed: string;
  point: string[];
}
