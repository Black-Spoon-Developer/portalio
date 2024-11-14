import axios from "axios";
import store, { RootState } from "../store";
import { BASE_URL } from "./BaseVariable";
import { authActions } from "../store/auth/AuthSlice";

// 티켓 값 변경하는 요청 함수 - 받는 변수명 userTicket
export const userTicketUpdate = async (ticketCount: number) => {
  const state: RootState = store.getState();
  const userTicketCount = Number(state.auth.memberTicket);
  const accessToken = state.auth.accessToken;

  if (userTicketCount === 0 && ticketCount < 0) {
    alert("티켓이 부족합니다.");
    return;
  }

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

  store.dispatch(authActions.updateTicket(response.data.userTicket));

  return response.data;
};
