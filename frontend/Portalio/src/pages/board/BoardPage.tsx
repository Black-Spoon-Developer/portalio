import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { issueAccessToken } from "../../api/AuthAPI";
import { UserInfo } from "../../type/UserType";
import { RootState } from "../../store";
import { authActions } from "../../store/auth/AuthSlice";
import SideNavBar from "../../components/common/navBarComponent/navBar/SideNavBar";

const BoardPage: React.FC = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

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
    <div className="grid-cols-4 min-h-screen">
      <section className="">
        <SideNavBar />
      </section>
    </div>
  );
};

export default BoardPage;
