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

export const getJobOpening = async (job_categories: number[]) => {
  try {
    const response = await axios.post(
      `${AI_BASE_URL}/api/v1/job-opening/categories`,
      { job_categories }, // job_categories를 객체로 감싸서 전송
      {
        headers: {
          "Content-Type": "application/json", // JSON으로 요청 전송
        },
      }
    );
    return response.data.matching_jobs;
  } catch (error) {
    console.error("채용 공고를 불러오는 데 실패했습니다.", error);
    throw error;
  }
};

