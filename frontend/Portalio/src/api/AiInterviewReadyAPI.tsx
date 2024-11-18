import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import {
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
} from "../interface/aiInterview/AICommonInterface";
import { MemberInfoDTO } from "../interface/aiInterview/AICommonInterface";
import store from "../store";

const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MTMsIm5hbWUiOiLquYDtl4zqt5wiLCJ1c2VybmFtZSI6IjExMDU2NDE3NDc2NzU4MTgwNDY1OCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKN2FNbG41NDc3ZXBSNDhVWldmWW1DaXF0TFRYMTVwU184YjBlN2ZRYWdyeHc0QWwxbj1zOTYtYyIsImNhdGVnb3J5IjoiYWNjZXNzIiwiZW1haWwiOiJraGc5MDU1QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzMxOTU5MjQ3LCJleHAiOjE3MzQ1NTEyNDd9.LaNT8S9ptsrRdgH5RFT7T4tLEW8hMqMuw-1ZtUFvxos";

// 인터뷰 준비
export const fetchPreInterview = async () => {
  try {
    // const state = store.getState();
    // const accessToken = state.auth.accessToken;

    const response = await axios.post<MemberInfoDTO>(
      `${AI_BASE_URL}/api/v1/mock-interview/pre-interview`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`사전 인터뷰 정보 조회 실패: ${error.message}`);
    }
    throw new Error("사전 인터뷰 정보 조회 중 알 수 없는 오류가 발생했습니다.");
  }
};

// 질문 생성 요청 API 함수
export const generateQuestions = async (request: GenerateQuestionsRequest) => {
  try {
    // const state = store.getState();
    // const accessToken = state.auth.accessToken;

    const response = await axios.post<GenerateQuestionsResponse>(
      `${AI_BASE_URL}/api/v1/mock-interview/generate-questions`,
      request,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("FastAPI 응답 데이터:", response.data.questions); // 디버깅용 로그
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`질문 생성 실패: ${error.message}`);
    }
    throw new Error("질문 생성 중 알 수 없는 오류가 발생했습니다.");
  }
};
