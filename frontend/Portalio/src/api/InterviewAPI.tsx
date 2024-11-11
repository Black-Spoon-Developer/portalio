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
export const uploadAnalysisResultApi = async (questionId: number, blob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("file", blob, `question_${questionId}.webm`);

    const response = await axios.post(
      `${BASE_URL}/api/v1/interviews/upload-analysis/${questionId}`,
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
