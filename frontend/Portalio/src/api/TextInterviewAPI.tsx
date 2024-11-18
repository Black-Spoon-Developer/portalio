import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";
import { TextAnswerRequest } from "../interface/aiInterview/TextInterviewInterface";
import { RootState } from "../store";
import store from "../store";

export const submitTextAnswer = async (request: TextAnswerRequest) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  await axios.post(
    `${AI_BASE_URL}/api/v1/mock-interview/text/submit-answer`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
