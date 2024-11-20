import React from "react";
import AI from "../../../assets/AI.png";
import { useNavigate } from "react-router-dom";

const AIinterviewPost: React.FC = () => {
  const navigate = useNavigate();

  // 이미지 클릭 핸들러
  const handleImageClick = () => {
    navigate("/ai/introduce");
  };

  return (
    <div className="mt-10">
      <header className="mb-3">💻 AI 모의 면접</header>
      <button
        onClick={handleImageClick}
        className="shadow-lg border-2 rounded-md w-[17vw] h-[34vh]"
      >
        <img src={AI} alt="" />
      </button>
    </div>
  );
};

export default AIinterviewPost;
