import React from "react";
import googleIcon from "../../../assets/googleIcon.png";

const GoogleLogin: React.FC = () => {
  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <button
      onClick={googleLogin}
      className="flex items-center justify-center w-5/6 h-14 bg-white font-bold border rounded-md shadow-md"
    >
      <img src={googleIcon} alt="Google Logo" className="w-6 h-6 mr-2" />
      구글 계정으로 로그인
    </button>
  );
};

export default GoogleLogin;
