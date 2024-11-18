import React from "react";
import { useNavigate } from "react-router-dom";
import character from "./../../../assets/character.png";

const AIinterviewPost: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/ai/introduce"); // 원하는 경로로 이동
  };

  return (
    <div className="mt-10">
      <header className="mb-3">💻 AI 모의 면접</header>
      <button
        className="shadow-lg border-2 rounded-md w-[17vw] h-auto flex flex-col items-center"
        onClick={handleNavigate}
      >
        <div className="relative w-full h-[70%] overflow-hidden">
          <img
            src={character}
            alt="character"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-2 text-lg font-bold">AI 모의 면접 하러 가기</div>
        <div className="text-gray-500">Port Alio</div>
      </button>
    </div>
  );
};

export default AIinterviewPost;
