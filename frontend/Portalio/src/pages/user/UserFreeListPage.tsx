// UserFreeListPage.tsx
import React, { useState, useEffect } from "react";
import TempBoardTab from "../../components/common/tab/TempBoardTab";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMyBoards } from "../../api/BoardAPI";

const ITEMS_PER_PAGE = 10; // 한 페이지에 보여줄 아이템 수

interface Board {
  boardId: number;
  boardCategory: "FREE";
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

const UserFreeListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [boards, setBoards] = useState<Board[]>([]); // Board 배열 상태 정의
  const itemsPerPage = 10;
  const username = useSelector((state: RootState) => state.auth.username);
  const { user_id } = useParams<{ user_id: string }>(); // URL에서 user_id 추출

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;

  // api 요청
  useEffect(() => {
    if (username) {
      const fetchMyBoards = async () => {
        try {
          const response = await getMyBoards(username, skip, limit, "FREE");
          setBoards(response.data.items);
          // console.log("API 응답 데이터:", response.items);
        } catch (error) {
          console.error("Failed to fetch boards:", error);
        }
      };
      fetchMyBoards();
    }
  }, [username, currentPage]); // currentPage가 바뀔 때마다 요청

  const totalPages = Math.ceil(boards.length / itemsPerPage);

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
  const currentBoards = boards.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <TempBoardTab user_id={user_id || ""} /> {/* 임시 보드 탭 추가 */}
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
            <Link to={`/free/${board.boardId}`} key={board.boardId}>
              <li
                key={board.boardId}
                className="flex justify-between items-center p-4 border-b last:border-b-0"
              >
                <span className="text-lg font-semibold">
                  {board.boardTitle}
                </span>
                <span className="text-gray-500">
                  {new Date().toLocaleDateString()}
                </span>
              </li>
            </Link>
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

export default UserFreeListPage;
