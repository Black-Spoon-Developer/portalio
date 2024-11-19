import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import { RootState } from "../store";
import store from "../store";

// 면접 결과 조회 요청 API
export const getAiInterviewAnalysis = async (interview_id: number) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/mock-interview/report/${interview_id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
