import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import { RootState } from "../store";
import store from "../store";

// Redux에서 토큰 가져오는 공통 함수
// 음성 면접 답변 제출 API
export const submitAudioAnswer = async (formData: FormData) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/mock-interview/audio/submit-answer`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
};

// 질문 목록 가져오기 API
export const fetchQuestionsApi = async () => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  try {
    const response = await axios.post(
      `${AI_BASE_URL}/interview/questions`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return null;
  }
};
