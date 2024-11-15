import React from "react";
import GoogleLoginbtn from "../button/GoogleLogin";
import NaverLogin from "../button/NaverLogin";

const UserLogin: React.FC = () => {
  return (
    <div className="space-y-4 text-center flex flex-col items-center">
      <div className="mt-2 w-full flex justify-center">
        <NaverLogin />
      </div>
      <div className="w-full flex justify-center">
        <GoogleLoginbtn />
      </div>
    </div>
  );
};

export default UserLogin;
