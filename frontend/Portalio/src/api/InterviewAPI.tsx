// src/api/interviewApi.ts
// import axios from "axios";

// const BASE_URL = "http://localhost:8000/api/v1/interview";

// // 질문 목록 가져오기 API
// export const fetchQuestionsApi = async () => {
//   try {
//     const response = await axios.post(`${BASE_URL}/interview/questions`, {});
//     // 서버에서 반환된 interviewId와 질문 목록
//     const { interview_id, questions } = response.data;

//     // interviewId를 localStorage에 저장 나중에는 DB에 저장해야함
//     if (interview_id) {
//       localStorage.setItem("interviewId", interview_id.toString());
//     }
    
//     return questions;

//   } catch (error) {
//     console.error("Failed to fetch questions:", error);
//     return null;
//   }
// };

// // 음성 업로드 API
// export const uploadAudioApi = async (interviewId: number, questionId: number, blob: Blob, retries: number = 3): Promise<any> => {
//   const formData = new FormData();
//   formData.append("file", blob, `question_${questionId}.wav`);

//   try {
//     const response = await fetch(`${BASE_URL}/interview/${interviewId}/questions/${questionId}/upload-audio`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Upload failed');
//     }

//     const result = await response.json();
//     return result.analysis_result;

//   } catch (error) {
//     if (retries > 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 후 재시도
//       return uploadAudioApi(interviewId, questionId, blob, retries - 1);
//     } else {
//       console.error("Failed to upload audio:", error);
//       return null;
//     }
//   }
// };

// // 비디오 업로드 API
// export const uploadVideoApi = async (interviewId: number, questionId: number, blob: Blob, retries: number = 3): Promise<any> => {
//   const formData = new FormData();
//   formData.append('file', blob, `question_${questionId}.mp4`);

//   try {
//     const response = await fetch(`${BASE_URL}/interview/${interviewId}/questions/${questionId}/upload-video`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Upload failed');
//     }

//     const result = await response.json();
//     return result.analysis_result;

//   } catch (error) {
//     if (retries > 0) {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 후 재시도
//       return uploadVideoApi(interviewId, questionId, blob, retries - 1);
//     } else {
//       throw error;
//     }
//   }
// };

// // 분석 결과 가져오기 API
// export const getAnalysisResultApi = async (interviewId: number) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/analysis/${interviewId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch analysis result:", error);
//     return null;
//   }
// };

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
