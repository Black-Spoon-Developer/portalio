import React from "react";
import naverLogo from "../../../assets/btnG_아이콘원형.png";

const NaverLogin: React.FC = () => {
  const NaverLogin = () => {
    const isLogin = localStorage.getItem("isLogin");

    if (isLogin) {
      localStorage.removeItem("isLogin");
    }

    localStorage.setItem("isLogin", "true");
    // EC2에 띄워놓고 할 때
    window.location.href =
      "https://k11d202.p.ssafy.io/oauth2/authorization/naver";

    // 로컬에서 할때
    // window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };

  return (
    <>
      <button
        onClick={NaverLogin}
        className="flex items-center justify-center w-5/6 h-14 bg-naverColor text-white font-bold text-xl border rounded-md shadow-md"
      >
        <img src={naverLogo} alt="Naver Logo" className="size-10 mr-2" />
        네이버 로그인
      </button>
    </>
  );
};

export default NaverLogin;
