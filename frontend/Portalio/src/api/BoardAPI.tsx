import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const fetchMorePosts = async (skip: number, limit: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/portfolios/all`, {
    params: { skip, limit },
  });
  return response.data.items;
};
