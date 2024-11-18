import React, { useState, useEffect } from "react";
import TempBoardTab from "../../components/common/tab/TempBoardTab";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMyActivities } from "../../api/BoardAPI";
import { getRepository } from "../../api/RepositoryAPI";
import ActivityDetailModal from "../../components/board/activity/ActivityDetailModal";

const ITEMS_PER_PAGE = 10;

interface Board {
  activityBoardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: Date;
  created: string;
  repositoryId: number;
  repositoryName?: string; // 추가된 레포지토리 이름
  picture: string; // 보드 관련 이미지
  member: {
    memberId: number;
    memberNickname: string;
  };
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const UserActivityListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const username = useSelector((state: RootState) => state.auth.memberUsername);
  const { user_id } = useParams<{ user_id: string }>();

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;

  useEffect(() => {
    if (username) {
      const fetchActivitiesWithRepositories = async () => {
        try {
          const activitiesResponse = await getMyActivities(
            username,
            skip,
            limit
          );

          const activitiesWithRepositoryNames = await Promise.all(
            activitiesResponse.data.items.map(async (activity: Board) => {
              const repository = await getRepository(activity.repositoryId);
              return {
                ...activity,
                repositoryName: repository.repositoryTitle,
              };
            })
          );

          setBoards(activitiesWithRepositoryNames);
        } catch (error) {
          console.error("Failed to fetch activities or repositories:", error);
        }
      };

      fetchActivitiesWithRepositories();
    }
  }, [username, currentPage]);

  const totalPages = Math.ceil(boards.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePostClick = (boardId: number) => {
    setSelectedBoardId(boardId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBoardId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <TempBoardTab user_id={user_id || ""} />
      <div className="flex justify-end mb-4">
        <button
          className="bg-sky-200 mt-4 px-4 py-2 text-gray-800 rounded-lg font-bold hover:bg-sky-300 transition"
          onClick={() => console.log("작성 버튼 클릭")}
        >
          작성
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg border">
        <ul>
          {boards.map((board) => (
            <li
              key={board.activityBoardId}
              onClick={() => handlePostClick(board.activityBoardId)}
              className="flex items-center justify-between p-4 border-b border-gray-300 hover:bg-gray-100 hover:shadow-md transition duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-4 w-full">
                {board.picture && (
                  <img
                    src={board.picture}
                    alt="Activity Thumbnail"
                    className="w-16 h-16 rounded-md object-cover"
                  />
                )}
                <div className="flex flex-col w-full">
                  <span className="text-lg font-semibold">
                    {truncateText(board.activityBoardTitle, 30)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {truncateText(board.activityBoardContent, 50)}
                  </span>
                  <span className="text-sm text-gray-400 mt-2">
                    레포지토리:{" "}
                    <span className="font-medium text-gray-600">
                      {board.repositoryName || "알 수 없는 레포지토리"}
                    </span>
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-400  whitespace-nowrap">
                {new Date(board.created)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, ".")}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            이전
          </button>
        )}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-sky-300 text-white font-semibold"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          )
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            다음
          </button>
        )}
      </div>

      {isModalOpen && selectedBoardId && (
        <ActivityDetailModal
          activityId={selectedBoardId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default UserActivityListPage;
