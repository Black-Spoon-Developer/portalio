import axios from "axios";
import store, { RootState } from "../store";
import { ActivityRequest } from "../type/ActivityType"

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "http://k11d202.p.ssafy.io";

// public으로 사람들이 올려놓은 포트폴리오 리스트 무한 스크롤 조회
export const fetchMoreActivity = async (skip: number, limit: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/activity/all`, {
    params: { skip, limit },
  });
  return response.data.items;
};

export const activitySearch = async (searchTerm: string) => {
  const response = await axios.get(`${BASE_URL}/api/v1/activity/all`, {
    params: { searchTerm },
  });

  return response.data.items;
};

export const registerActivity = async (repository_id: string, activityData: ActivityRequest) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.post(
    `${BASE_URL}/api/v1/activity/onlyactivity/${repository_id}`,
    activityData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data
}

export const getActivityBoard = async (activity_id: string) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/activity/${activity_id}`,
  );
  return response.data
}

export const patchActivityBoard = async (repository_id: string, activity_id: string, activityData: ActivityRequest) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.patch(
    `${BASE_URL}/api/v1/activity/onlyactivity/${repository_id}/${activity_id}`,
    activityData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data
}