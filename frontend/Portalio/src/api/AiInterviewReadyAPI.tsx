import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import {
  GenerateQuestionsRequest,
  GenerateQuestionsResponse,
} from "../interface/aiInterview/AICommonInterface";
import { MemberInfoDTO } from "../interface/aiInterview/AICommonInterface";

const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6NCwibmFtZSI6IuycpOuvvOyerCIsInVzZXJuYW1lIjoiTHJuVFJYazlscy1DSFRwNXMyQzVPMEJHMmpic3NZd3VNeWpxZXEwYkJGYyIsInBpY3R1cmUiOiJkZWZhdWx0X3BpY3R1cmVfdXJsIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJlbWFpbCI6InN0eWxpc2h5MjUyOUBuYXZlci5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczMTgzMzcxNCwiZXhwIjoxNzM0NDI1NzE0fQ.PjA4wOtuEQeaXcUFxuQmr3iwXH5dBi3hNWtquFPEKx4";

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
