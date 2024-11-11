import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuestions } from "../../store/interview/InterviewSlice";

const InterviewQuestionPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 질문을 생성하여 상태에 저장
    dispatch(setQuestions(["질문 1", "질문 2", "질문 3", "질문 4", "질문 5"]));
  }, [dispatch]);

  const handleProceedToSetup = () => {
    navigate("/ai/interview/setup");
  };

  return (
    <div>
      <h1>질문이 생성되었습니다.</h1>
      <button onClick={handleProceedToSetup}>준비로 이동</button>
    </div>
  );
};

export default InterviewQuestionPage;
