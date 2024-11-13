import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchQuestionsApi } from "../../api/InterviewAPI";
import { interviewActions } from "../../store/interview/InterviewSlice";

const InterviewQuestionPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // API에서 질문을 가져와 상태에 저장
    const fetchQuestions = async () => {
      const questions = await fetchQuestionsApi();
      if (questions) {
        dispatch(interviewActions.setQuestions(questions));
      }
    };

    fetchQuestions();
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
