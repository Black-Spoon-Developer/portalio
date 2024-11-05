import React, { useEffect } from "react";
import { issueAccessToken } from "../api/AuthAPI";
import { userTokenFetchAPI } from "../api/MemberAPI";

interface UserInfo {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPicture: string;
  memberRole: string;
}

const MainTest: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      // access 토큰 저장
      const fetchAccessToken = async () => {
        const isLogin = localStorage.getItem("isLogin");
        const accessToken = localStorage.getItem("access");

        if (accessToken == null && isLogin == "true") {
          const newAccessToken = await issueAccessToken();
          if (newAccessToken) {
            localStorage.setItem("access", newAccessToken);
          }
        }
      };

      // 엑세스 토큰으로 회원 정보 조회 후 localstorage에 저장
      const userInfofetch = async () => {
        const accessToken = localStorage.getItem("access");
        const userInfo = localStorage.getItem("userInfo");
        const isLogin = localStorage.getItem("isLogin");

        if (
          accessToken &&
          !userInfo &&
          !(isLogin == null || isLogin == "false")
        ) {
          const userInfo = await userTokenFetchAPI();
          if (userInfo) {
            const setUserInfo: UserInfo = {
              memberId: userInfo.data.memberId,
              memberName: userInfo.data.memberName,
              memberEmail: userInfo.data.memberEmail,
              memberPicture: userInfo.data.memberPicture,
              memberRole: userInfo.data.memberRole,
            };
            localStorage.setItem("userInfo", JSON.stringify(setUserInfo));
          }
        }
      };

      await fetchAccessToken(); // access 토큰 가져오기
      await userInfofetch(); // 토큰을 가져온 후 회원 정보 조회
    };

    fetchData(); // 비동기 함수 실행
  }, []);

  return (
    <>
      <div>안녕하세요</div>
      <div>메인 페이지 test</div>
    </>
  );
};

export default MainTest;
