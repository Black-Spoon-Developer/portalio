import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import BasicProfile from "../../assets/BasicProfile.png";

// 로그인 여부에 따라 다르도록 해줘야함
const NavBar: React.FC = () => {
  const navigate = useNavigate();

  // 메인 페이지로 이동하게 하는 메서드
  const goToMainPage = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-between">
      <button onClick={goToMainPage}>
        {/* 로고 이미지 */}
        <img src={Logo} alt="no-image" className="p-3 w-48" />
      </button>
      {/* 프로필 */}
      <div className="flex items-center p-3">
        <div className="mx-3 font-bold">게스트</div>
        <img src={BasicProfile} alt="" className="size-10 mx-3" />
      </div>
    </div>
  );
};

export default NavBar;
