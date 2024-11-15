import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMyPortfolios } from "../../api/PortfolioAPI";
import { getMyBoards, getMyActivities } from "../../api/BoardAPI";
import { getRepository, getMyRepositoryList } from "../../api/RepositoryAPI";
import ProfileIntroduce from "../../components/mypage/ProfileIntroduce";
import JobHistory from "../../components/mypage/JobHistory";
import SocialLink from "../../components/mypage/SocialLink";
import PrimaryPortfolio from "../../components/mypage/PrimaryPortfolio";
import PrimaryRepository from "../../components/mypage/PrimaryRepository";
import PostsBoards from "../../components/mypage/PostBoards";

interface Activity {
  activityBoardId: number;
  activityBoardTitle: string;
  repositoryId: number;
  repositoryName: string;
}

interface Portfolio {
  created: Date;
  portfolioId: number;
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioIsPrimary: boolean;
  portfolioCommentCount: number;
  portfolioThumbnailImg: string;
  memberId: number;
  memberNickname: string;
}

const UserProfilePage: React.FC = () => {
  // 페이지 기본 변수
  const username = useSelector((state: RootState) => state.auth.memberUsername);

  // 게시판 관련 변수
  const skip = 0;

  const limit = 2;

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
          const portfoliosResponse = await getMyPortfolios(username, 0, 100);
          const repositoryResponse = await getMyRepositoryList(username);
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
          setRepositories(repositoryResponse.items.slice(0, 3));

          const primaryPortfolio = portfoliosResponse.data.items.find(
            (item: Portfolio) => item.portfolioIsPrimary == true
          );
          setPortfolio(primaryPortfolio);
        } catch (error) {
          console.error("Failed to fetch boards:", error);
        }
      };
      fetchMyInfos();
    }
  }, []);

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1"></div>
      {/* 프로필 및 이력 / 경력, 소셜 섹션 */}
      <div className="col-span-2 my-8 flex flex-col ">
        <section className="border-2 border-gray-400 mb-4 p-5 rounded-md bg-white">
          <ProfileIntroduce />
          <div className="flex">
            {/* 이력 / 경력 섹션 */}
            <JobHistory />

            {/* 소셜 섹션 */}
            <SocialLink />
          </div>
        </section>
        {/* 대표 포트폴리오 */}
        <section className="border-2 border-gray-400 rounded-md mb-4 p-3">
          <PrimaryPortfolio />
        </section>
        {/* 대표 레포지토리 및 작성한 게시글 섹션 */}
        <section className="flex border-2 border-gray-400 p-5 rounded-md">
          {/* 대표 레포지토리 */}
          <PrimaryRepository />
          {/* 작성한 게시글 */}
          <PostsBoards />
        </section>
      </div>
    </div>
  );
};

export default UserProfilePage;
