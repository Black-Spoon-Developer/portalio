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
  startPreparation, // 새로 추가된 액션 임포트
} from "../../store/interview/InterviewSlice";
import QuestionTimer from "../../components/ai/QuestionTimer";
import { useNavigate } from "react-router-dom";

const InterviewProcessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questions, currentQuestionIndex, isAnswering, isFinished } = useSelector(
    (state: RootState) => state.interview
  );

  // 준비 시간 여부를 관리하는 상태
  const [isPreparationTime, setIsPreparationTime] = useState(true);

  const handlePreparationEnd = useCallback(() => {
    console.log("handlePreparationEnd 호출");
    setIsPreparationTime(false);
    dispatch(startAnswering());
    console.log("준비시간 끝, 답변 시작");
  }, [dispatch]);
  
  const [isAnsweringFinished, setIsAnsweringFinished] = useState(false); // 중복 실행 방지 플래그

  const handleAnswerEnd = useCallback(() => {
    if (isAnsweringFinished) return;  // 이미 답변이 끝났다면 함수 실행 중단
    
    setIsAnsweringFinished(true); // 답변 완료 처리
    console.log("handleAnswerEnd 호출");
    
    dispatch(stopAnswering());
    console.log("답변시간 끝");

    if (currentQuestionIndex < questions.length - 1) {
      dispatch(incrementQuestionIndex());
      dispatch(startPreparation()); // 다음 질문 준비 상태로 전환
      console.log("다음 질문으로 이동:", currentQuestionIndex + 1);
    } else {
      console.log("모든 질문이 끝남, 분석 페이지로 이동");
      navigate("/ai/analyze");
    }
  }, [currentQuestionIndex, dispatch, navigate, questions.length, isAnsweringFinished]);

useEffect(() => {
  // 새로운 질문에 진입할 때마다 플래그 초기화
  setIsAnsweringFinished(false);
}, [currentQuestionIndex]);


  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setIsPreparationTime(true);
      console.log("새로운 질문에 대한 준비 시간 시작");
    }
  }, [currentQuestionIndex, questions.length]);


  const handleRestart = () => {
    console.log("면접 재시작");
    dispatch(resetInterview());
    setIsPreparationTime(true);
  };

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentQuestionIndex");
    console.log("저장된 질문 인덱스:", savedIndex);
    dispatch(setQuestions(["첫번째 질문", "두번째 질문", "세번째 질문", "네번째 질문", "다섯번째 질문"]));
  
    if (savedIndex) {
      dispatch(setCurrentQuestionIndex(Number(savedIndex)));
      console.log("저장된 인덱스로 설정:", savedIndex);
    } else {
      dispatch(setCurrentQuestionIndex(0));
      console.log("저장된 인덱스가 없으므로 0으로 초기화");
    }
  }, [dispatch]);
  
  useEffect(() => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
    console.log("currentQuestionIndex가 업데이트됨:", currentQuestionIndex);
  }, [currentQuestionIndex]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-12 text-center">
        {/* Step 표시 */}
        <div className="flex space-x-10 justify-center mb-6">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full ${
                  index <= currentQuestionIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        <h2 className="font-bold text-lg">면접 진행 중</h2>
      </header>

      <section className="flex justify-center items-start space-x-16">
        <div className="w-1/2 max-w-lg bg-white rounded-lg shadow-md p-4 relative">
          
          {/* 면접 타입과 타이머 표시 */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700">화상 면접</span>
            <QuestionTimer
              isPreparationTime={isPreparationTime}
              preparationTime={30}
              answerTime={60}
              onPreparationEnd={handlePreparationEnd}
              onAnswerEnd={handleAnswerEnd}
            />
          </div>

          {/* 화상 면접 화면 */}
          <div className="bg-gray-200 w-full mb-4 rounded-md flex items-center justify-center">
            <WebcamCapture />
          </div>
        </div>

        {/* 질문 및 답변 버튼 */}
        <div className="w-1/3 flex flex-col justify-end h-full">
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {`질문 ${currentQuestionIndex + 1}`}
            </h2>
            <p className="text-2xl font-bold text-gray-800">{questions[currentQuestionIndex]}</p>
          </section>

          <button
            onClick={isPreparationTime ? handlePreparationEnd : handleAnswerEnd}
            className={`w-full py-3 text-white rounded-lg text-lg transition ${
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
