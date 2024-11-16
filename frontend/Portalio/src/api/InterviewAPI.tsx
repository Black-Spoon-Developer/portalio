import axios from "axios";
import { Dispatch } from "@reduxjs/toolkit";
import { interviewActions } from "../store/interview/InterviewSlice"

const BASE_URL = "http://localhost:8000/api/v1/mock-interview";


// 질문 목록 가져오기 API (기존 유지)
export const fetchQuestionsApi = async (dispatch:Dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/interview/questions`, {});
    const { interview_id, questions } = response.data;

    if (interview_id) {
      // 중앙 저장소에 interview와 question 저장
      dispatch(interviewActions.setInterviewId(interview_id));
      dispatch(interviewActions.setQuestions(questions));
    }

    return questions;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return null;
  }
};

// 비디오 업로드 및 분석 API
export const uploadVideoApi = async (
  interviewId: number,
  questionId: number,
  blob: Blob,
  portfolioId?: number,
  repositoryId?: number
): Promise<any> => {
  const formData = new FormData();

  // FastAPI의 `/video/submit-answer`에 필요한 요청 데이터를 추가
  const requestPayload = JSON.stringify({
    interview_id: interviewId,
    question_id: questionId,
    portfolio_id: portfolioId,
    repository_id: repositoryId,
  });

  formData.append("request", requestPayload);
  formData.append("video_file", blob, `question_${questionId}.mp4`);

  try {
    // FastAPI의 `/video/submit-answer` 호출
    const response = await fetch(`${BASE_URL}/video/submit-answer`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload or analysis failed");
    }

    // FastAPI에서 반환된 데이터를 파싱
    const result = await response.json();
    return result; // 분석 및 피드백 결과
  } catch (error) {
    console.error("Failed to upload video or fetch analysis:", error);
    return null;
  }
};


// 음성 면접 업로드 및 분석
export const uploadAudioApi = async (
  interviewId: number,
  questionId: number,
  blob: Blob,
  portfolioId?: number,
  repositoryId?: number
): Promise<any> => {
  const formData = new FormData();

  // FastAPI의 `/audio/submit-answer`에 필요한 요청 데이터를 추가
  const requestPayload = JSON.stringify({
    interview_id: interviewId,
    question_id: questionId,
    portfolio_id: portfolioId,
    repository_id: repositoryId,
  });

  formData.append("request", requestPayload);
  formData.append("audio_file", blob, `question_${questionId}.wav`);

  try {
    // FastAPI의 `/audio/submit-answer` 호출
    const response = await fetch(`${BASE_URL}/audio/submit-answer`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload or analysis failed");
    }

    // FastAPI에서 반환된 데이터를 파싱
    const result = await response.json();
    return result; // 분석 및 피드백 결과
  } catch (error) {
    console.error("Failed to upload audio or fetch analysis:", error);
    return null;
  }
};

// 텍스트 면접 업로드 및 분석
export const submitTextAnswerApi = async (
  interviewId: number,
  questionId: number,
  answerText: string,
  portfolioId?: number,
  repositoryId?: number
): Promise<any> => {
  // 요청 페이로드 생성
  const requestPayload = {
    interview_id: interviewId,
    question_id: questionId,
    answer_text: answerText,
    portfolio_id: portfolioId,
    repository_id: repositoryId,
  };

  try {
    // FastAPI의 `/text/submit-answer` 호출
    const response = await fetch(`${BASE_URL}/text/submit-answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON 요청임을 명시
      },
      body: JSON.stringify(requestPayload), // 요청 데이터를 JSON 문자열로 변환
    });

    // 응답이 성공하지 않으면 에러 처리
    if (!response.ok) {
      throw new Error("Failed to submit text answer");
    }

    // FastAPI에서 반환된 데이터를 JSON으로 파싱
    const result = await response.json();
    return result; // 분석 및 피드백 결과 반환
  } catch (error) {
    console.error("Failed to submit text answer:", error);
    return null; // 실패 시 null 반환
  }
};



// 분석 결과 가져오기 API (기존 유지)
export const getAnalysisResultApi = async (interviewId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/analysis/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch analysis result:", error);
    return null;
  }
};
