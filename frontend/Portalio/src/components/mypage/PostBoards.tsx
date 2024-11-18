import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyBoards } from "../../api/BoardAPI";
import { getMyActivities } from "../../api/BoardAPI";
import { useEffect } from "react";
import { getRepository } from "../../api/RepositoryAPI";
import ActivityDetailModal from "../board/activity/ActivityDetailModal";

interface Free {
  boardId: number;
  boardTitle: string;
}

interface Question {
  boardId: number;
  boardTitle: string;
}

interface Activity {
  activityBoardId: number;
  activityBoardTitle: string;
  repositoryId: number;
  repositoryName: string;
}

const PostsBoards: React.FC = () => {
  // 페이지 기본 변수
  const { username } = useParams<{ username: string }>();

  // 게시판 관련 변수
  const skip = 0;
  const limit = 2;
  const [frees, setFrees] = useState<Free[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // 모달 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(
    null
  );

  // 긴 글자 -> ... 으로 대체
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  // api 요청
  useEffect(() => {
    if (username) {
      const fetchMyInfos = async () => {
        try {
          // 게시글 요청
          const freesResponse = await getMyBoards(
            username,
            skip,
            limit,
            "FREE"
          );
          const questionsResponse = await getMyBoards(
            username,
            skip,
            limit,
            "QUESTION"
          );
          const activitiesResponse = await getMyActivities(
            username,
            skip,
            limit
          );

          const activitiesWithRepositoryNames = await Promise.all(
            activitiesResponse.data.items.map(async (activity: Activity) => {
              const repository = await getRepository(activity.repositoryId);
              return {
                ...activity,
                repositoryName: repository.repositoryTitle, // repository의 이름을 저장
              };
            })
          );

          setFrees(freesResponse.data.items);
          setQuestions(questionsResponse.data.items);
          setActivities(activitiesWithRepositoryNames);
        } catch (error) {
          console.error("Failed to fetch boards:", error);
        }
      };
      fetchMyInfos();
    }
  }, []);

  // 활동 게시글 클릭 시 모달 열기
  const handleActivityClick = (activityId: number) => {
    setSelectedActivityId(activityId);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivityId(null);
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">작성한 게시글</h2>
      <section className="space-y-4">
        {/* 활동 게시글 */}
        <div className="bg-white shadow rounded-lg p-4 border">
          <h3 className="flex justify-between items-center mb-3">
            <span className="font-bold text-xl">활동 게시글</span>
            <Link
              to={`/users/profile/${username}/activity`}
              className="text-sm text-blue-500 hover:underline"
            >
              더 보기 →
            </Link>
          </h3>
          <ul className="space-y-3">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li
                  key={activity.activityBoardId}
                  className="flex items-center text-gray-800 hover:text-blue-500"
                  onClick={() => handleActivityClick(activity.activityBoardId)}
                >
                  [{truncateText(activity.repositoryName, 10)}]
                  {truncateText(activity.activityBoardTitle, 13)}
                </li>
              ))
            ) : (
              <li className="text-gray-500">작성한 활동 게시글이 없어요</li>
            )}
          </ul>
        </div>

        {/* 자유 게시글 */}
        <div className="bg-white shadow rounded-lg p-4 border">
          <h3 className="flex justify-between items-center mb-3">
            <span className="font-bold text-xl">자유 게시글</span>
            <Link
              to={`/users/profile/${username}/free`}
              className="text-sm text-blue-500 hover:underline"
            >
              더 보기 →
            </Link>
          </h3>
          <ul className="space-y-3">
            {frees.length > 0 ? (
              frees.map((free) => (
                <li key={free.boardId}>
                  <Link
                    to={`/free/${free.boardId}`}
                    className="text-gray-800 hover:text-blue-500"
                  >
                    {truncateText(free.boardTitle, 20)}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500">작성한 자유 게시글이 없어요</li>
            )}
          </ul>
        </div>

        {/* 질문 게시글 */}
        <div className="bg-white shadow rounded-lg p-4 border">
          <h3 className="flex justify-between items-center mb-3">
            <span className="font-bold text-xl">질문 게시글</span>
            <Link
              to={`/users/profile/${username}/question`}
              className="text-sm text-blue-500 hover:underline"
            >
              더 보기 →
            </Link>
          </h3>
          <ul className="space-y-3">
            {questions.length > 0 ? (
              questions.map((question) => (
                <li key={question.boardId}>
                  <Link
                    to={`/question/${question.boardId}`}
                    className="text-gray-800 hover:text-blue-500"
                  >
                    {truncateText(question.boardTitle, 20)}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-gray-500">작성한 질문 게시글이 없어요</li>
            )}
          </ul>
        </div>
      </section>
      {isModalOpen && selectedActivityId && (
        <ActivityDetailModal
          activityId={selectedActivityId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default PostsBoards;
