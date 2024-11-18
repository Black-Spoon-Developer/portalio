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
  const [activities, setActivities] = useState<Board[]>([]);
  const username = useSelector((state: RootState) => state.auth.memberUsername);
  const userId = useSelector((state: RootState) => state.auth.memberId);
  const navigate = useNavigate();

  useEffect(() => {
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

    const fetchActivities = async () => {
      try {
        if (repository_id) {
          const response = await getMyActivities(username || "", 0, 100);
          const filteredActivities = response.data.items.filter(
            (activity: Board) =>
              activity.repositoryId === parseInt(repository_id, 10)
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

  const handleDelete = async () => {
    if (repository_id) {
      const confirmDelete = window.confirm(
        "정말로 이 레포지토리를 삭제하시겠습니까?"
      );
      if (confirmDelete) {
        try {
          await deleteRepository(parseInt(repository_id, 10));
          alert("레포지토리가 삭제되었습니다.");
          navigate(`/users/profile/${userId}/repository`);
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
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200 mb-8">
          {/* Header */}
          <header className="flex justify-between items-center border-b pb-4 mb-6">
            <h1
              className="text-2xl font-extrabold text-gray-800 truncate leading-tight w-full"
              title={repository.repositoryTitle}
            >
              {repository.repositoryTitle}
            </h1>
            <div className="flex space-x-4">
              <Link
                to={`/repository/edit/${repository.repositoryId}`}
                className="text-sm bg-teal-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-teal-300 transition truncate"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className="text-sm bg-rose-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-rose-300 transition truncate"
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
      <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">활동 내역</h2>
        <ul className="divide-y divide-gray-200">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <li
                key={activity.activityBoardId}
                className="flex items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-4 w-full">
                  {activity.picture && (
                    <img
                      src={activity.picture}
                      alt="Activity Thumbnail"
                      className="w-16 h-16 rounded-md object-cover shadow-sm"
                    />
                  )}
                  <div className="flex flex-col w-full">
                    <span className="text-lg font-semibold text-gray-800">
                      {activity.activityBoardTitle}
                    </span>
                    <span className="text-sm text-gray-500 truncate">
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
