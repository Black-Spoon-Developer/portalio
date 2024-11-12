// src/pages/interview/InterviewProcessPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import WebcamCapture from "../../components/ai/WebcamCapture";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  incrementQuestionIndex,
  setCurrentQuestionIndex,
  resetInterview,
  setQuestions,
  startAnswering,
  stopAnswering,
  startPreparation,
} from "../../store/interview/InterviewSlice";
import QuestionTimer from "../../components/ai/QuestionTimer";
import { useNavigate, useLocation } from "react-router-dom";

const InterviewProcessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, currentQuestionIndex } = useSelector((state: RootState) => state.interview);

  const interviewType = location.state?.interviewType || "video"; // 기본값을 "video"로 설정

  const [isPreparationTime, setIsPreparationTime] = useState(true);

  const handlePreparationEnd = useCallback(() => {
    setIsPreparationTime(false);
    dispatch(startAnswering());
  }, [dispatch]);

  const handleAnswerEnd = useCallback(() => {
    dispatch(stopAnswering());

    if (currentQuestionIndex < questions.length - 1) {
      dispatch(incrementQuestionIndex());
      setIsPreparationTime(true);
      dispatch(startPreparation());
    } else {
      navigate("/ai/analyze");
    }
  }, [currentQuestionIndex, dispatch, navigate, questions.length]);

  useEffect(() => {
    dispatch(setQuestions(["첫번째 질문", "두번째 질문", "세번째 질문", "네번째 질문", "다섯번째 질문"]));
    dispatch(setCurrentQuestionIndex(0));
    dispatch(startPreparation());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-12 text-center">
        {/* Step 표시 */}
        <div className="flex space-x-12 justify-center mb-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center font-bold text-white rounded transform rotate-45 ${
                index <= currentQuestionIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span className="transform -rotate-45">{index + 1}</span>
            </div>
          ))}
        </div>
      </header>

      <section className="flex justify-center items-start space-x-16">
        {/* 인터뷰 타입에 따라 다른 화면 표시 */}
        <div className="w-1/2 max-w-lg bg-white rounded-lg shadow-md p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700">
              {interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}
            </span>
            <QuestionTimer
              isPreparationTime={isPreparationTime}
              preparationTime={30}
              answerTime={60}
              onPreparationEnd={handlePreparationEnd}
              onAnswerEnd={handleAnswerEnd}
            />
          </div>

          {/* 면접 화면 표시 */}
          <div className="bg-gray-200 w-full mb-4 rounded-md flex items-center justify-center">
            {interviewType === "video" && <WebcamCapture />}
            {interviewType === "audio" && <img src="/path/to/default-image.png" alt="음성 면접 이미지" />}
            {interviewType === "text" && (
              <p className="text-gray-500">텍스트 면접에서는 질문에 텍스트로 답변하세요.</p>
            )}
          </div>
        </div>

        {/* 질문 및 답변 버튼 영역 */}
        <div className="w-1/3 flex flex-col relative" style={{ height: "448px" }}>
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {`질문 ${currentQuestionIndex + 1}`}
            </h2>
            <p className="text-2xl font-bold text-gray-800">{questions[currentQuestionIndex]}</p>
          </section>

          <button
            onClick={isPreparationTime ? handlePreparationEnd : handleAnswerEnd}
            className={`w-full py-3 text-white rounded-lg text-lg absolute bottom-0 transition ${
              isPreparationTime ? "bg-teal-500 hover:bg-teal-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPreparationTime ? "답변하기" : "답변 완료"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default InterviewProcessPage;
