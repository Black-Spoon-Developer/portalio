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
export const getBoardComments = async (boardId: string) => {
  try {
    console.log(boardId);
    const response = await axios.get(
      `${BASE_URL}/api/v1/boards/${boardId}/comments`
    );
    console.log(response.data.items);

    // 댓글이 없으면 null 반환
    return response.data.items;
  } catch (error) {
    console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
    return [];
  }
};

// 자유/질문 게시판 댓글 작성
export const postBoardComments = async (boardId: string, content: string) => {
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

// 자유/질문 게시판 좋아요
export const boardDetailLike = async (boardId: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  try {
    await axios.post(
      `${BASE_URL}/api/v1/boards/${boardId}/recom`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    alert("좋아요에 실패 했습니다. " + error);
  }
};

// 질문 게시글 해결 처리
export const questionBoardSolve = async (boardId: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  try {
    await axios.patch(
      `${BASE_URL}/api/v1/${boardId}/solve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    alert("질문 게시글 해결에 실패 했습니다. " + error);
  }
};

// 자유/질문게시판 글 전체보기(내 것만)
export const getMyBoards = async (
  username: string,
  skip: number,
  limit: number,
  boardCategory: string
) => {
  const response = await axios.get(`${BASE_URL}/api/v1/boards/my/${username}`, {

    params: {
      skip: skip,
      limit: limit,
      boardCategory: boardCategory,
    },
  });

  return response;
};

// 활동게시판 글 전체보기(내 것만)
export const getMyActivities = async (
  username: string,
  skip: number,
  limit: number
) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/activity/my/${username}`,
    {
      params: {
        skip: skip,
        limit: limit,
      },
    }
  );

  return response;
};

// 질문 게시판 해결 처리
export const patchSolveBoard = async (boardID: string) => {
  const state: RootState = store.getState();
  const accessToken = state.auth.accessToken;

  try {
    await axios.patch(
      `${BASE_URL}/api/v1/boards/${boardID}/solve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    alert(error);
  }
};
