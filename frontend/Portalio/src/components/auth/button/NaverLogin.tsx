import React, { useEffect } from "react";
import naverLogo from "../../../assets/btnG_아이콘원형.png";
import { fetchUserInfo } from "../../../api/auth/LoginAPI";

interface UserInfo {
  username: string;
  email: string;
}

const NaverLogin: React.FC = () => {
  const NaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
  };

  useEffect(() => {
    // URL 파라미터에서 토큰과 유저 정보 추출
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access");

    if (accessToken) {
      // localStorage에 저장
      localStorage.setItem("access", accessToken);

      // URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 회원 정보 조회 및 저장
    fetchUserInfo();
  }, []);

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
