// src/store/interviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InterviewState } from "../../type/InterviewType";

const initialState: InterviewState = {
  questions: [],
  currentQuestionIndex: 0,
  isAnswering: false,
  isRecording: false,
  isLoading: true,
  isUploading: false,
  analysisResults: {},
  isFinished: false,
  isPreparationTime: true, // 추가된 상태
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
    startPreparation(state) {
      state.isPreparationTime = true;
      state.isAnswering = false;
    },
    incrementQuestionIndex(state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.isFinished = true;
      }
    
    },

    setCurrentQuestionIndex(state, action) {
      // action.payload로 받은 인덱스를 설정
      state.currentQuestionIndex = action.payload;
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
  setCurrentQuestionIndex,
  resetInterview,
  setLoading,
  startPreparation, // 새로 추가된 액션
} = interviewSlice.actions;

export default interviewSlice.reducer;
