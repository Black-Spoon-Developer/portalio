// src/store/interviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InterviewState } from "../../type/InterviewType";

const initialState: InterviewState = {
  questions: [],
  currentQuestionIndex: 0,
  preparationTime: 30,
  answerTime: 60,
  isAnswering: false,
  isRecording: false,
  isLoading: true,
  isUploading: false,
  analysisResults: {},
  isFinished: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<string[]>) {
      state.questions = action.payload;
      state.isLoading = false;
    },
    startAnswering(state) {
      state.isAnswering = true;
      state.isRecording = true;
    },
    stopAnswering(state) {
      state.isAnswering = false;
      state.isRecording = false;
      state.isUploading = true;
    },
    incrementQuestionIndex(state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.isFinished = true; // 모든 질문이 완료된 경우 isFinished 플래그 설정
      }
    },
    uploadComplete(
      state,
      action: PayloadAction<{ questionIndex: number; result: any }>
    ) {
      const { questionIndex, result } = action.payload;
      state.analysisResults[questionIndex] = result;
      state.isUploading = false;
      state.isAnswering = false;

      if (state.currentQuestionIndex === state.questions.length - 1) {
        state.isFinished = true;
      } else {
        state.currentQuestionIndex += 1;
      }
    },
    resetInterview(state) {
      state.currentQuestionIndex = 0;
      state.isFinished = false;
      state.isAnswering = false;
      state.isRecording = false;
      state.isUploading = false;
      state.analysisResults = {};
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setQuestions,
  startAnswering,
  stopAnswering,
  incrementQuestionIndex, 
  uploadComplete,
  resetInterview,
  setLoading,
} = interviewSlice.actions;

export default interviewSlice.reducer;
