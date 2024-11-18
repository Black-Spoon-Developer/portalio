import axios from "axios";
import { FAST_URL } from "./BaseVariable";
import store, { RootState } from "../store";
import { FastRequest } from "../type/AiInterview";

export const getInterviewReports = async (FastData: FastRequest) => {
  const state: RootState = store.getState();
  // const accessToken = "state.auth.accessToken;"
  const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6NCwibmFtZSI6IuycpOuvvOyerCIsInVzZXJuYW1lIjoiTHJuVFJYazlscy1DSFRwNXMyQzVPMEJHMmpic3NZd3VNeWpxZXEwYkJGYyIsInBpY3R1cmUiOiJkZWZhdWx0X3BpY3R1cmVfdXJsIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJlbWFpbCI6InN0eWxpc2h5MjUyOUBuYXZlci5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczMTgzMzcxNCwiZXhwIjoxNzM0NDI1NzE0fQ.PjA4wOtuEQeaXcUFxuQmr3iwXH5dBi3hNWtquFPEKx4"
  console.log(accessToken)
  const response = await axios.post(
    `${FAST_URL}/api/v1/mock-interview/reports`,
    FastData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data
}