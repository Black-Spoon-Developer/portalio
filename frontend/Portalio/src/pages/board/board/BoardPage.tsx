import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { issueAccessToken } from "../../../api/AuthAPI";
import { UserInfo } from "../../../type/UserType";
import { RootState } from "../../../store";
import { authActions } from "../../../store/auth/AuthSlice";
import SideNavBar from "../../../components/common/navBar/SideNavBar";
import PopularPortfolio from "../../../components/common/popularPortfolio/PopularPortfolio";
import AIinterviewPost from "../../../components/common/aiInterviewPost/AIinterviewPost";
import BoardTab from "../../../components/common/tab/BoardTab";
import PortfolioPosts from "../../../components/board/portfolio/PortfolioPosts";
import ActivityPosts from "../../../components/board/activity/ActivityPosts";

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

          // 유저 정보 저장
          const memberId = response.data.memberId.toString();
          const name = response.data.name;
          const username = response.data.username;
          const picture = response.data.picture;
          const role = response.data.role;

          const userInfo: UserInfo = {
            accessToken: newAccessToken,
            memberId,
            name,
            username,
            picture,
            role,
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
