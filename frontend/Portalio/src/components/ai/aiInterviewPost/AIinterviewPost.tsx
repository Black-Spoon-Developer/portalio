import React from "react";
import AIimage from "../../../assets/AI.png";
import { useNavigate } from "react-router-dom";

const AIinterviewPost: React.FC = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/ai/introduce")
  };


  return (
    <div className="mt-10">
      <header className="mb-3">💻 AI 모의 면접</header>
      <button
        className="shadow-lg border-2 rounded-md w-[17vw] h-[34vh]"
        onClick={handleButtonClick} // 버튼 클릭 시 URL로 이동
      >
        <img src={AIimage} alt="" />
      </button>
    </div>
  );
};

export default AIinterviewPost;
