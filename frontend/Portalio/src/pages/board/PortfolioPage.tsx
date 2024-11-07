import React, { useEffect } from "react";
import { issueAccessToken } from "../../api/AuthAPI";
import { UserInfo } from "../../type/UserType";

const PortfolioPage: React.FC = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    // access 토큰 저장
    const issueToken = async () => {
      const response = await issueAccessToken();
      if (response) {
        const newAccessToken = response.data.access;
        localStorage.setItem("access", newAccessToken);

        // 유저 정보 저장
        const memberId = response.data.memberId.toString();
        const name = response.data.name;
        const username = response.data.username;
        const picture = response.data.picture;
        const role = response.data.role;

        const userInfo: UserInfo = {
          memberId,
          name,
          username,
          picture,
          role,
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }
    };

    if (accessToken == null) {
      issueToken();
    }
  }, []);
  return <></>;
};

export default PortfolioPage;
