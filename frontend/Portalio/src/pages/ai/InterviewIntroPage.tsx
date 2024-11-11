import React from "react";
import { useNavigate } from "react-router-dom";



const InterviewIntroPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartButtonClick = () => {
    navigate("/ai/interview/questions");
  };

  return (
    <div>
      <h1>면접 설명</h1>
      <p>면접 과정에 대한 간단한 설명이 들어갑니다.</p>
      <button onClick={handleStartButtonClick}>시작</button>
    </div>
  );
};

export default InterviewIntroPage;
