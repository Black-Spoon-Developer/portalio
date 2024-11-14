// src/store/interviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InterviewState } from "../../type/InterviewType";

const initialState: InterviewState = {
  interviewId: 1,
  questions: [],
  currentQuestionIndex: 0,
  isAnswering: false,
  isRecording: false,
  isLoading: true,
  isUploading: false,
  analysisResults: {},
  pendingUploads: [],  
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
      state.isPreparationTime = false;
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
      state.currentQuestionIndex = action.payload;
    },
    
    resetInterview(state) {
      state.interviewId = 1;
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
    addPendingUpload(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.pendingUploads)) {
        state.pendingUploads = []; // pendingUploads가 배열이 아닐 경우 빈 배열로 초기화
      }
      state.pendingUploads.push(action.payload);
      console.log("Inside addPendingUpload - pendingUploads:", state.pendingUploads);
    },
    removePendingUpload(state, action: PayloadAction<number>) {
      state.pendingUploads = state.pendingUploads.filter(id => id !== action.payload);
      console.log("Inside removePendingUpload - pendingUploads:", state.pendingUploads);
    },
    saveAnalysisResult(state, action: PayloadAction<{ questionId: number, result: any }>) {
      state.analysisResults[action.payload.questionId] = action.payload.result;
    },
  },
});


export const interviewActions = interviewSlice.actions;

export default interviewSlice.reducer;
