import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyBoards } from "../../api/BoardAPI";
import { useSelector } from "react-redux";
import { getMyActivities } from "../../api/BoardAPI";
import { RootState } from "../../store";
import { useEffect } from "react";
import { getRepository } from "../../api/RepositoryAPI";

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
  const username = useSelector((state: RootState) => state.auth.memberUsername);
  const { user_id } = useParams<{ user_id: string }>();
  // 게시판 관련 변수
  const skip = 0;
  const limit = 2;
  const [frees, setFrees] = useState<Free[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

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

  return (
    <div className="w-1/2 ml-2">
      <h2 className="font-bold text-2xl">작성한 게시글</h2>
      <section className="mt-3">
        {/* 활동 게시글 */}
        <section>
          <h3 className="flex justify-between items-center">
            <div className="font-bold text-xl my-4">활동 게시글</div>

            <Link to={`/users/profile/${user_id}/activity`} className="text-sm">
              더 보기 →
            </Link>
          </h3>
          <ul>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <li key={activity.activityBoardId}>
                  <Link to={`/activity/${activity.activityBoardId}`}>
                    <span className="font-bold text-black">
                      [{activity.repositoryName}]
                    </span>{" "}
                    {activity.activityBoardTitle}
                  </Link>
                </li>
              ))
            ) : (
              <li className="">작성한 활동 게시글이 없어요</li>
            )}
          </ul>
        </section>
        <section>
          <h3 className="flex justify-between items-center">
            <div className="font-bold text-xl my-4">자유 게시글</div>
            <Link to={`/users/profile/${user_id}/free`} className="text-sm">
              더 보기 →
            </Link>
          </h3>
          <ul>
            {frees.length > 0 ? (
              frees.map((free) => (
                <li key={free.boardId}>
                  <Link to={`/free/${free.boardId}`}>{free.boardTitle}</Link>
                </li>
              ))
            ) : (
              <li>작성한 자유 게시글이 없어요</li>
            )}
          </ul>
        </section>
        <section>
          <h3 className="flex justify-between items-center">
            <div className="font-bold text-xl my-4">질문 게시글</div>
            <Link to={`/users/profile/${user_id}/question`} className="text-sm">
              더 보기 →
            </Link>
          </h3>
          <ul>
            {questions.length > 0 ? (
              questions.map((question) => (
                <li key={question.boardId}>
                  <Link to={`/question/${question.boardId}`}>
                    {question.boardTitle}
                  </Link>
                </li>
              ))
            ) : (
              <li>작성한 질문 게시글이 없어요</li>
            )}
          </ul>
        </section>
      </section>
    </div>
  );
};

export default PostsBoards;
