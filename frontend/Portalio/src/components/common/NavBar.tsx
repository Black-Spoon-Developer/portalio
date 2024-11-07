import React from "react";
import { useSelector } from "react-redux";
import UserNavbar from "./navBarComponent/UserNavbar";
import GuestNavbar from "./navBarComponent/GuestNavbar";
import RecruiterNavbar from "./navBarComponent/RecruiterNavbar";
import { RootState } from "../../store";

const NavBar: React.FC = () => {
  // authSlice에서 role 값 가져오기
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <>
      {role === "USER" && <UserNavbar />}
      {role === "RECRUITER" && <RecruiterNavbar />}
      {role === null && <GuestNavbar />}
    </>
  );
};

export default NavBar;
