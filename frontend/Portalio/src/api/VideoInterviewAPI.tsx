import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import { RootState } from "../store";
import store from "../store";

const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MTMsIm5hbWUiOiLquYDtl4zqt5wiLCJ1c2VybmFtZSI6IjExMDU2NDE3NDc2NzU4MTgwNDY1OCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKN2FNbG41NDc3ZXBSNDhVWldmWW1DaXF0TFRYMTVwU184YjBlN2ZRYWdyeHc0QWwxbj1zOTYtYyIsImNhdGVnb3J5IjoiYWNjZXNzIiwiZW1haWwiOiJraGc5MDU1QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzMxOTU5MjQ3LCJleHAiOjE3MzQ1NTEyNDd9.LaNT8S9ptsrRdgH5RFT7T4tLEW8hMqMuw-1ZtUFvxos";

export const submitVideoAnswer = async (formData: FormData) => {
  // const state: RootState = store.getState();
  // const accessToken = state.auth.accessToken;
  const response = await axios.post(
    `${AI_BASE_URL}/api/v1/mock-interview/video/submit-answer`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log(response.data);

  return response.data;
};
