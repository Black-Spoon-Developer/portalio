import axios from "axios";
import store, { RootState } from "../store";
import { BoardRequest, BoardResponse } from "../type/BoardType"


// const BASE_URL = "http://localhost:8080";
const BASE_URL = "https://k11d202.p.ssafy.io";

// 자유/질문게시판 글쓰기
export const createBoard = async (boardData: BoardRequest): Promise<BoardResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.post<BoardResponse>(
    `${BASE_URL}/api/v1/boards`,
    boardData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

// 자유/질문게시판 글 수정
export const patchBoard = async (boardID: string, boardData: BoardRequest): Promise<BoardResponse> => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.patch<BoardResponse>(
    `${BASE_URL}/api/v1/boards/${boardID}`,
    boardData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

// 자유/질문게시판 글 상세보기
export const getBoard = async (boardID: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.get(
    `${BASE_URL}/api/v1/boards/${boardID}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
}