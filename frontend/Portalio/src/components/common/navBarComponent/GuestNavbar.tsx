import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import BasicProfile from "../../../assets/BasicProfile.png";

const GuestNavbar: React.FC = () => {
  const navigate = useNavigate();

  // 메인 페이지로 이동하게 하는 메서드
  const goToMainPage = () => {
    navigate("/");
  };

  return (
    <nav className="flex justify-between">
      <button onClick={goToMainPage}>
        {/* 로고 이미지 */}
        <img src={Logo} alt="no-image" className="p-3 w-48" />
      </button>
      {/* 프로필 */}
      <div className="flex items-center p-3">
        <div className="mx-3 font-bold">게스트</div>
        <img src={BasicProfile} alt="" className="size-10 mx-3" />
      </div>
    </nav>
  );
};

export default GuestNavbar;
