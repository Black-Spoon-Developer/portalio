import React from "react";
import { useSelector } from "react-redux";
import UserNavbar from "./UserNavbar";
import GuestNavbar from "./GuestNavbar";
import RecruiterNavbar from "./RecruiterNavbar";
import { RootState } from "../../../store";

const NavBar: React.FC = () => {
  // authSlice에서 role 값 가져오기
  const role = useSelector((state: RootState) => state.auth.memberRole);

  return (
    <>
      {role === "USER" && <UserNavbar />}
      {role === "RECRUITER" && <RecruiterNavbar />}
      {role === null && <GuestNavbar />}
    </>
  );
};

export default NavBar;
