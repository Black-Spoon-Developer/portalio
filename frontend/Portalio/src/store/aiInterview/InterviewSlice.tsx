import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  InterViewState,
  GenerateQuestionsResponse,
} from "../../interface/aiInterview/AICommonInterface";

const initialState: InterViewState = {
  isRecording: false,
  audioUrl: null,
  response: null,
  isLoading: false,
  questionId: null,
  interviewId: null,
  portfolioId: null,
  repositoryId: null,
  questions: [], // 초기값으로 빈 배열 설정
  currentIndex: 0,
};

const InterviewSlice = createSlice({
  name: "aiInterview",
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<GenerateQuestionsResponse>) {
      const { interview_id, portfolio_id, repository_id, questions } =
        action.payload;
      state.interviewId = interview_id;
      state.portfolioId = portfolio_id ?? null;
      state.repositoryId = repository_id ?? null;
      state.questions = questions;
    },
    startIsRecording(state) {
      state.isRecording = true;
    },
    endIsRecording(state) {
      state.isRecording = false;
    },
    setQuestionId(state, action) {
      state.questionId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    incrementCurrentIndex(state) {
      state.currentIndex += 1;
    },
    resetState() {
      return initialState;
    },
  },
});

export const InterviewActions = InterviewSlice.actions;
export default InterviewSlice.reducer;
