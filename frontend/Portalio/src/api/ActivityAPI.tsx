import axios from "axios";
import { BASE_URL } from "./BaseVariable";

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
