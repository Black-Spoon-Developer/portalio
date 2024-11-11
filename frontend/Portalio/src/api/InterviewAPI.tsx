// src/api/interviewApi.ts
import axios from "axios";


const BASE_URL = "http://localhost:8080";

// 질문 목록 가져오기 API
export const fetchQuestionsApi = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/v1/interviews/start`, {});
    return response.data.questions;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return null;
  }
};

// 분석 결과 업로드 API
export const uploadAnalysisResultApi = async (interviewId: number, questionId: number, blob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("file", blob, `question_${questionId}.webm`);

    const response = await axios.post(
      `${BASE_URL}/api/v1/interviews/${interviewId}/upload-analysis/${questionId}`, // interviewId 포함
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.analysis_result;
  } catch (error) {
    console.error("Failed to upload analysis result:", error);
    return null;
  }
};


export const uploadVideoApi = async (interviewId: number, questionId: number, blob: Blob, retries: number = 3): Promise<any> => {
  const formData = new FormData();
  formData.append('file', blob, `question_${questionId}.webm`);

  try {
    const response = await fetch(`${BASE_URL}/upload-video/${interviewId}/${questionId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result.analysis_result;

  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 후 재시도
      return uploadVideoApi(interviewId, questionId, blob, retries - 1);
    } else {
      throw error;
    }
  }
};
