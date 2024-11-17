import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  getRepositoryDetail,
  deleteRepository,
} from "./../../../api/RepositoryAPI";
import { getMyActivities } from "../../../api/BoardAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface Repository {
  repositoryId: number;
  repositoryTitle: string;
  repositoryContent: string;
  startDate: string;
  endDate: string;
}

interface Board {
  activityBoardId: number;
  activityBoardTitle: string;
  activityBoardContent: string;
  activityBoardDate: Date;
  created: string;
  repositoryId: number;
  repositoryName?: string;
  picture: string;
  member: {
    memberId: number;
    memberNickname: string;
  };
}

const RepositoryDetailPage: React.FC = () => {
  const { repository_id } = useParams<{ repository_id: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [activities, setActivities] = useState<Board[]>([]); // 활동 내역 상태 추가
  const username = useSelector((state: RootState) => state.auth.memberUsername);
  const userId = useSelector((state: RootState) => state.auth.memberId);
  const navigate = useNavigate();

  useEffect(() => {
    // 레포지토리 상세 내용 가져오기
    const fetchRepositoryDetail = async () => {
      try {
        if (repository_id) {
          const response = await getRepositoryDetail(
            parseInt(repository_id, 10)
          );
          setRepository(response);
        }
      } catch (error) {
        console.error("Failed to fetch repository detail:", error);
      }
    };

    // 활동 내역 가져오기
    const fetchActivities = async () => {
      try {
        if (repository_id) {
          const response = await getMyActivities(
            username || '', 
            0,
            100 // 최대 100개 가져오기
          );
          const filteredActivities = response.data.items.filter(
            (activity: Board) => activity.repositoryId === parseInt(repository_id, 10)
          );
          setActivities(filteredActivities);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchRepositoryDetail();
    fetchActivities();
  }, []);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (repository_id) {
      const confirmDelete = window.confirm(
        "정말로 이 레포지토리를 삭제하시겠습니까?"
      );
      if (confirmDelete) {
        try {
          await deleteRepository(parseInt(repository_id, 10));
          alert("레포지토리가 삭제되었습니다.");
          navigate(`/users/profile/${userId}/repository`); // 삭제 후 목록 페이지로 이동
        } catch (error) {
          console.error("Failed to delete repository:", error);
          alert("레포지토리 삭제에 실패했습니다.");
        }
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {repository ? (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200 mb-8">
          {/* Header */}
          <header className="flex justify-between items-center border-b pb-4 mb-6">
            <h1
              className="text-3xl font-extrabold text-gray-800 truncate leading-normal"
              title={repository.repositoryTitle}
            >
              {repository.repositoryTitle}
            </h1>
            <div className="flex space-x-4">
              <Link
                to={`/repository/edit/${repository.repositoryId}`}
                className="text-sm bg-[#57D4E2] text-white px-3 py-1 rounded hover:bg-[#45B4C0] transition"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                삭제
              </button>
            </div>
          </header>

          {/* 소개 섹션 */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">소개</h2>
            <p className="text-gray-600 leading-relaxed break-words">
              <ReactMarkdown>{repository.repositoryContent}</ReactMarkdown>
            </p>
          </section>

          {/* 기간 섹션 */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">기간</h2>
            <p className="text-gray-600">
              {repository.startDate} ~ {repository.endDate}
            </p>
          </section>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      )}

      {/* 활동 내역 섹션 */}
      <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">활동 내역</h2>
        <ul>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li
                key={activity.activityBoardId}
                className="flex items-center justify-between p-4 border-b border-gray-300 hover:bg-gray-100 hover:shadow-md transition duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-4 w-full">
                  {activity.picture && (
                    <img
                      src={activity.picture}
                      alt="Activity Thumbnail"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  <div className="flex flex-col w-full">
                    <span className="text-lg font-semibold">
                      {activity.activityBoardTitle}
                    </span>
                    <span className="text-sm text-gray-500">
                      {activity.activityBoardContent}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {new Date(activity.created)
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, ".")}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">활동 내역이 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RepositoryDetailPage;
