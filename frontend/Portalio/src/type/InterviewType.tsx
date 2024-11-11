export type InterviewType = "video" | "audio" | "text"; // 인터뷰 타입 정의

export interface AnalysisResult {
  [key: number]: any;
}

export interface InterviewState {
  questions: string[];
  currentQuestionIndex: number;
  preparationTime: number;
  answerTime: number;
  isAnswering: boolean;
  isRecording: boolean;
  isLoading: boolean;
  isUploading: boolean;
  analysisResults: AnalysisResult;
  isFinished: boolean;
}

// WebcamCapture 컴포넌트의 props 타입 정의
export interface WebcamCaptureProps {
  //isRecording: boolean;
  interviewType?: InterviewType; // 인터뷰 타입 추가
  interviewId?: number;
  questionId?: number;
  onUploadComplete?: (result: any) => void;
}

// QuestionTimer 컴포넌트의 props 타입 정의
export interface QuestionTimerProps {
  time: number;
  onTimeEnd: () => void;
  label: string;
}

export interface TimeSeriesData {
  time: string;
  emotion: string;
  movement_focus: string;
  gaze_focus: string;
}

export interface ResultData {
  "current emotion"?: string;
  "movement focus"?: string;
  "gaze focus"?: string;
  "time_series_data"?: TimeSeriesData[];
}

export interface AnalysisResultsProps {
  results: ResultData[];
}

// InterviewProcess 컴포넌트의 props 타입 정의
export interface InterviewProcessProps {
  interviewType: InterviewType; // 인터뷰 타입 추가
  interviewId: number;
}
