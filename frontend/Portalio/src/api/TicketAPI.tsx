import axios from "axios";
import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";

// 티켓 값 변경하는 요청 함수 - 받는 변수명 userTicket
export const userTicketUpdate = async (ticketCount: number) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.patch(
    `${BASE_URL}/api/v1/users/ticket/update`,
    {},
    {
      params: { ticketCount },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
