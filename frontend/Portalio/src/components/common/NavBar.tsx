import React, { useState, useEffect } from "react";
import UserNavbar from "./navBarComponent/userNavbar";
import GuestNavbar from "./navBarComponent/guestNavbar";
import RecruiterNavbar from "./navBarComponent/recruiterNavbar";

const NavBar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // localStorage에서 userInfo 가져오기
    const isLogin = localStorage.getItem("isLogin");
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      // userInfo를 파싱하고 memberRole에 따라 상태 업데이트
      const parsedInfo = JSON.parse(userInfo);
      setRole(parsedInfo.memberRole);
    } else {
      // userInfo가 없으면 역할을 null로 설정 (Guest 상태)
      setRole(null);
    }
  }, []);

  return (
    <>
      {role === "USER" && <UserNavbar />}
      {role === "RECRUITER" && <RecruiterNavbar />}
      {role === null && <GuestNavbar />}
    </>
  );
};

export default NavBar;
