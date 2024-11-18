import React from "react";
import ProfileIntroduce from "../../components/mypage/ProfileIntroduce";
import JobHistory from "../../components/mypage/JobHistory";
import SocialLink from "../../components/mypage/SocialLink";
import PrimaryPortfolio from "../../components/mypage/PrimaryPortfolio";
import PrimaryRepository from "../../components/mypage/PrimaryRepository";
import PostsBoards from "../../components/mypage/PostBoards";

const UserProfilePage: React.FC = () => {
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
        <section className="flex border-2 border-gray-400 rounded-md p-5 bg-white space-x-4">
          <div className="flex-1">
            <PrimaryRepository />
          </div>
          <div className="flex-1">
            <PostsBoards />
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfilePage;
