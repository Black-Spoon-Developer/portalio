import axios from "axios";
import store, { RootState } from "../store";
import { BoardRequest, BoardResponse } from "../type/BoardType";
import { BASE_URL } from "./BaseVariable";

// 자유/질문게시판 글쓰기
export const createBoard = async (
  boardData: BoardRequest
): Promise<BoardResponse> => {
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
};

// 자유/질문게시판 글 수정
export const patchBoard = async (
  boardID: string,
  boardData: BoardRequest
): Promise<BoardResponse> => {
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
};

// 자유/질문게시판 글 상세보기
export const getBoard = async (boardID: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;
  const response = await axios.get(`${BASE_URL}/api/v1/boards/${boardID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
};

// 자유/질문 게시판 리스트 조회
export const getBoardList = async (
  skip: number,
  limit: number,
  boardCategory: string
) => {
  const response = await axios.get(`${BASE_URL}/api/v1/boards/all`, {
    params: {
      skip,
      limit,
      boardCategory,
    },
  });

  return response.data.items;
};

// 자유/질문 게시판 글 검색
export const searchBoardList = async (
  boardTitle: string,
  boardCategory: string
) => {
  const response = await axios.get(`${BASE_URL}/api/v1/boards`, {
    params: {
      boardTitle,
      boardCategory,
    },
  });

  return response.data.items;
};

// 자유/질문 게시판 댓글 조회
export const getBoardComments = async (boardId: number) => {
  const response = await axios.get(`${BASE_URL}/api/v1/comments`);

  return response.data.items;
};

// 자유/질문 게시판 댓글 작성
export const postBoardComments = async (boardId: number, content: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  const response = await axios.post(
    `${BASE_URL}/api/v1/boards/${boardId}/comments`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
