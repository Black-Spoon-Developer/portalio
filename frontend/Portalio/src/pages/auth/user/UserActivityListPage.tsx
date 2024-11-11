// UserFreeListPage.tsx
import React, { useState } from "react";
import TempBoardTab from "../../../components/common/tab/TempBoardTab";
import { useParams } from "react-router-dom";

interface Board {
  activityBoardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: string; // or Date, depending on how you handle dates
  activityBoardImgKey: string;
  repository?: {
    repositoryId: number;
  };
}

const mockBoards: Board[] = [
  { activityBoardId: 1, activityBoardTitle: "활동 게시글 1", activityBoardContent: "게시글 내용 1", activityBoardDate: "2024-11-12", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 1 } },
  { activityBoardId: 2, activityBoardTitle: "활동 게시글 2", activityBoardContent: "게시글 내용 2", activityBoardDate: "2024-11-13", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 2 } },
  { activityBoardId: 3, activityBoardTitle: "활동 게시글 3", activityBoardContent: "게시글 내용 3", activityBoardDate: "2024-11-14", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 3 } },
  { activityBoardId: 4, activityBoardTitle: "활동 게시글 4", activityBoardContent: "게시글 내용 4", activityBoardDate: "2024-11-15", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 4 } },
  { activityBoardId: 5, activityBoardTitle: "활동 게시글 5", activityBoardContent: "게시글 내용 5", activityBoardDate: "2024-11-16", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 5 } },
  { activityBoardId: 6, activityBoardTitle: "활동 게시글 6", activityBoardContent: "게시글 내용 6", activityBoardDate: "2024-11-17", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 6 } },
  { activityBoardId: 7, activityBoardTitle: "활동 게시글 7", activityBoardContent: "게시글 내용 7", activityBoardDate: "2024-11-18", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 7 } },
  { activityBoardId: 8, activityBoardTitle: "활동 게시글 8", activityBoardContent: "게시글 내용 8", activityBoardDate: "2024-11-19", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 8 } },
  { activityBoardId: 9, activityBoardTitle: "활동 게시글 9", activityBoardContent: "게시글 내용 9", activityBoardDate: "2024-11-20", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 9 } },
  { activityBoardId: 10, activityBoardTitle: "활동 게시글 10", activityBoardContent: "게시글 내용 10", activityBoardDate: "2024-11-21", activityBoardImgKey: "https://portalio.s3.ap-northeast-2.amazonaws.com/exec/default_img.png", repository: { repositoryId: 10 } },
];



const UserActivityListPage: React.FC = () => {
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
              key={board.activityBoardId}
              className="flex justify-between items-center p-4 border-b last:border-b-0"
            >
              <span className="text-lg font-semibold">{board.activityBoardTitle}</span>
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

export default UserActivityListPage;