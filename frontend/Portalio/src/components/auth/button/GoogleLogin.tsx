import React from "react";
import googleIcon from "../../../assets/googleIcon.png";

const GoogleLogin: React.FC = () => {
  const googleLogin = () => {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin) {
      localStorage.removeItem("isLogin");
    }

    localStorage.setItem("isLogin", "true");

    //EC2에서 할때
    window.location.href =
      "https://k11d202.p.ssafy.io/oauth2/authorization/google";

    // 로컬에서 할때
    // window.location.href = "http://localhost:8080/oauth2/authorization/google";
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
