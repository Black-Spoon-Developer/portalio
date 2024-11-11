// UserFreeListPage.tsx
import React, { useState } from "react";
import TempBoardTab from "../../../components/common/tab/TempBoardTab";
import { useParams } from "react-router-dom";

interface Board {
  boardId: number;
  boardCategory: "FREE" | "ACTIVITY" | "QUESTION";
  boardTitle: string;
  boardContent: string;
  boardImgKey: string;
  boardSolve: boolean;
  boardViews: number;
  boardRecommendationCount: number;
  member: {
    memberId: number;
    name: string;
  };
}


// 목업 데이터
const mockBoards: Board[] = [
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
  { boardId: 1, boardCategory: "FREE", boardTitle: "질문 게시글 1", boardContent: "게시글 내용 1", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 34, boardRecommendationCount: 5, member: { memberId: 1, name: "홍길동" } },
  { boardId: 2, boardCategory: "FREE", boardTitle: "질문 게시글 2", boardContent: "게시글 내용 2", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 12, boardRecommendationCount: 2, member: { memberId: 2, name: "이순신" } },
  { boardId: 3, boardCategory: "FREE", boardTitle: "질문 게시글 3", boardContent: "게시글 내용 3", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 45, boardRecommendationCount: 8, member: { memberId: 3, name: "강감찬" } },
  { boardId: 4, boardCategory: "FREE", boardTitle: "질문 게시글 4", boardContent: "게시글 내용 4", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 22, boardRecommendationCount: 3, member: { memberId: 4, name: "유관순" } },
  { boardId: 5, boardCategory: "FREE", boardTitle: "질문 게시글 5", boardContent: "게시글 내용 5", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 19, boardRecommendationCount: 1, member: { memberId: 5, name: "신사임당" } },
  { boardId: 6, boardCategory: "FREE", boardTitle: "질문 게시글 6", boardContent: "게시글 내용 6", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 31, boardRecommendationCount: 4, member: { memberId: 6, name: "세종대왕" } },
  { boardId: 7, boardCategory: "FREE", boardTitle: "질문 게시글 7", boardContent: "게시글 내용 7", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 28, boardRecommendationCount: 6, member: { memberId: 7, name: "정약용" } },
  { boardId: 8, boardCategory: "FREE", boardTitle: "질문 게시글 8", boardContent: "게시글 내용 8", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 40, boardRecommendationCount: 7, member: { memberId: 8, name: "장영실" } },
  { boardId: 9, boardCategory: "FREE", boardTitle: "질문 게시글 9", boardContent: "게시글 내용 9", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: true, boardViews: 50, boardRecommendationCount: 10, member: { memberId: 9, name: "이황" } },
  { boardId: 10, boardCategory: "FREE", boardTitle: "질문 게시글 10", boardContent: "게시글 내용 10", boardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", boardSolve: false, boardViews: 15, boardRecommendationCount: 2, member: { memberId: 10, name: "김구" } },
];

const UserQuestionListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockBoards.length / itemsPerPage);
  const { userId } = useParams<{ userId: string }>(); // URL에서 userId를 추출
  console.log("userId:", userId); // userId가 제대로 받아졌는지 확인
  // 한 번에 보여줄 페이지 버튼의 범위
  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(page);
    }
    return pageNumbers;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBoards = mockBoards.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <TempBoardTab userId={userId || ''} /> {/* 임시 보드 탭 추가 */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-[#57D4E2] text-white py-2 px-4 rounded-md font-semibold"
          onClick={() => console.log("작성 버튼 클릭")}
        >
          작성
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg border">
        <ul>
          {currentBoards.map((board) => (
            <li
              key={board.boardId}
              className="flex justify-between items-center p-4 border-b last:border-b-0"
            >
              <span className="text-lg font-semibold">{board.boardTitle}</span>
              <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center mt-4 space-x-2">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            이전
          </button>
        )}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-[#57D4E2] text-white font-semibold"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default UserQuestionListPage;