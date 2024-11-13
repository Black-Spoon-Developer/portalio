export type InterviewType = "video" | "audio" | "text"; // 인터뷰 타입 정의

export interface AnalysisResult {
  [key: number]: any;
}

export interface InterviewState {
  interviewId: number | null;  // interviewId 추가
  questions: string[];
  currentQuestionIndex: number;
  isAnswering: boolean;
  isRecording: boolean;
  isLoading: boolean;
  isUploading: boolean;
  analysisResults: AnalysisResult;
  pendingUploads: number[];
  isFinished: boolean;
  isPreparationTime: boolean;
}

// WebcamCapture 컴포넌트의 props 타입 정의
export interface WebcamCaptureProps {
  isRecording?: boolean;
  interviewType?: InterviewType; // 인터뷰 타입 추가
  interviewId?: number;
  questionId?: number;
  onUploadComplete?: (result: any) => void;
  onRecordingComplete?: (blob: Blob) => void;
  audioOnly?: boolean;
}

// QuestionTimer 컴포넌트의 props 타입 정의

export interface QuestionTimerProps {
  isPreparationTime: boolean;
  preparationTime: number;
  answerTime: number;
  onPreparationEnd: () => void;
  onAnswerEnd: () => void;
}


export interface TimeSeriesData {
  time: number;
  emotion: string;
  movement_focus: number;
  gaze_focus: number;
}

export interface ResultData {
  "current_emotion"?: string;
  "movement_focus"?: number;
  "gaze_focus"?: number;
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
