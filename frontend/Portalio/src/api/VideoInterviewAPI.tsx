import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import { RootState } from "../store";
import store from "../store";

export const submitVideoAnswer = async (formData: FormData) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
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
