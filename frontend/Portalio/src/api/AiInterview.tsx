import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import store, { RootState } from "../store";
import { FastRequest } from "../type/AiInterview";

export const getInterviewReports = async (FastData: FastRequest) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/mock-interview/reports`,
    FastData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data
}