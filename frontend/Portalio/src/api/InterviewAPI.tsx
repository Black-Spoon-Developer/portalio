// src/api/interviewApi.ts
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/ai";

// 질문 목록 가져오기 API
export const fetchQuestionsApi = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/interview/questions`, {});
    // 서버에서 반환된 interviewId와 질문 목록
    const { interview_id, questions } = response.data;

    // interviewId를 localStorage에 저장 나중에는 DB에 저장해야함
    if (interview_id) {
      localStorage.setItem("interviewId", interview_id.toString());
    }
    
    return questions;

  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return null;
  }
};

// 음성 업로드 API
export const uploadAnalysisResultApi = async (interviewId: number, questionId: number, blob: Blob) => {
  try {
    const formData = new FormData();
    formData.append("file", blob, `question_${questionId}.wav`);

    const response = await axios.post(
      `${BASE_URL}/interview/${interviewId}/questions/${questionId}/upload-audio`,
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

// 비디오 업로드 API
export const uploadVideoApi = async (interviewId: number, questionId: number, blob: Blob, retries: number = 3): Promise<any> => {
  const formData = new FormData();
  formData.append('file', blob, `question_${questionId}.mp4`);

  try {
    const response = await fetch(`${BASE_URL}/interview/${interviewId}/questions/${questionId}/upload-video`, {
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

// 분석 결과 가져오기 API
export const getAnalysisResultApi = async (interviewId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/analysis/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch analysis result:", error);
    return null;
  }
};
