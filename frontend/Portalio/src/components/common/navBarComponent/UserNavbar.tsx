import React from "react";
import Logo from "../../../assets/Logo.png";
import BasicProfile from "../../../assets/BasicProfile.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../../store/auth/AuthSlice";
import { logoutApi } from "../../../api/AuthAPI";

const UserNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goToMainPage = () => {
    navigate("/");
  };

  // 로그아웃 메서드
  const handleLogout = async () => {
    // 로그아웃 요청
    dispatch(authActions.logout());
    logoutApi();

    // 로그아웃 후 메인 페이지로 이동
    navigate("/");
  };

  return (
    <>
      <div className="flex justify-between">
        <button onClick={goToMainPage}>
          {/* 로고 이미지 */}
          <img src={Logo} alt="no-image" className="p-3 w-48" />
        </button>
        {/* 프로필 및 로그아웃 버튼 */}
        <div className="flex items-center p-3">
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="mx-3 p-2 text-white font-bold bg-rose-300 rounded shadow-sm hover:text-rose-400"
          >
            로그아웃
          </button>
          {/* 로그인된 유저의 정보 표시 */}
          <div className="mx-5 font-bold">유저</div>

          <img src={BasicProfile} alt="Profile" className="size-10 mx-3" />
        </div>
      </div>
    </>
  );
};

export default UserNavbar;
