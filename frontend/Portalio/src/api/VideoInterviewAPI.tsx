import axios from "axios";
import { AI_BASE_URL } from "./BaseVariable";

const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6NCwibmFtZSI6IuycpOuvvOyerCIsInVzZXJuYW1lIjoiTHJuVFJYazlscy1DSFRwNXMyQzVPMEJHMmpic3NZd3VNeWpxZXEwYkJGYyIsInBpY3R1cmUiOiJkZWZhdWx0X3BpY3R1cmVfdXJsIiwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJlbWFpbCI6InN0eWxpc2h5MjUyOUBuYXZlci5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTczMTgzMzcxNCwiZXhwIjoxNzM0NDI1NzE0fQ.PjA4wOtuEQeaXcUFxuQmr3iwXH5dBi3hNWtquFPEKx4";

export const submitVideoAnswer = async (formData: FormData) => {
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
