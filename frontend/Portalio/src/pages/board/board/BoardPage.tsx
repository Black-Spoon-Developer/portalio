import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { issueAccessToken } from "../../../api/AuthAPI";
import { UserInfo } from "../../../type/UserType";
import { RootState } from "../../../store";
import { authActions } from "../../../store/auth/AuthSlice";
import SideNavBar from "../../../components/common/navBar/SideNavBar";
import PopularPortfolio from "../../../components/common/popularPortfolio/PopularPortfolio";
import AIinterviewPost from "../../../components/ai/aiInterviewPost/AIinterviewPost";
import BoardTab from "../../../components/common/tab/BoardTab";
import PortfolioPosts from "../../../components/board/portfolio/PortfolioPosts";
import ActivityPosts from "../../../components/board/activity/ActivityPosts";
import FreePosts from "../../../components/board/free/FreePosts";
import QuestionPosts from "../../../components/board/question/QuestionPosts";

const BoardPage: React.FC = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // 선택된 탭 상태 관리
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const isLogin = localStorage.getItem("isLogin");
      if (!accessToken && isLogin == "true") {
        // access 토큰 발급
        const response = await issueAccessToken();

        if (response) {
          const newAccessToken = response.data.access;

          let memberAuth: boolean = false;

          if (response.data.auth === "1") {
            memberAuth = true;
          }

          // 유저 정보 저장
          const userInfo: UserInfo = {
            accessToken: newAccessToken,
            memberId: response.data.memberId,
            memberName: response.data.name,
            memberUsername: response.data.username,
            memberNickname: response.data.nickname,
            memberPicture: response.data.picture,
            memberRole: response.data.role,
            memberTicket: response.data.tickets,
            memberAuth: memberAuth,
            memberJob: response.data.jobSubCategoryId,
          };

          dispatch(authActions.login(userInfo));
        }
      }
    };

    fetchAccessToken();
  }, []);
  return (
    <div className="grid grid-cols-4 min-h-screen">
      <div className="fixed top-48 left-0 h-full">
        <SideNavBar />
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-2">
        <div className="flex justify-start">
          <BoardTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
        <div>
          {/* 선택된 탭에 따라 다른 게시판 컴포넌트를 표시 */}
          {selectedTab === 0 && <PortfolioPosts />}
          {selectedTab === 1 && <ActivityPosts />}
          {selectedTab === 2 && <FreePosts />}
          {selectedTab === 3 && <QuestionPosts />}
        </div>
      </div>
      <div className="fixed top-24 right-12">
        <PopularPortfolio />
        <AIinterviewPost />
      </div>
    </div>
  );
};

export default BoardPage;
