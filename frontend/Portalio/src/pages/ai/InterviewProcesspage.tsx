// src/pages/interview/InterviewProcessPage.tsx
import React, { useEffect } from "react";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { startAnswering, stopAnswering, incrementQuestionIndex,resetInterview } from "../../store/interview/InterviewSlice";
import InterviewProcess from "../../components/ai/InterviewProcess";
import QuestionTimer from "../../components/ai/QuestionTimer"; 


const steps = ["1", "2", "3", "4", "5"];



const InterviewProcessPage: React.FC = () => {
  const { interview_id } = useParams<{ interview_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const interviewType = location.state?.type || "video"; 
  const interviewId = parseInt(interview_id || "0", 10);

  const {
    questions,
    currentQuestionIndex,
    preparationTime,
    answerTime,
    isAnswering,
  } = useSelector((state: RootState) => state.interview);

  // 준비시간 타이머 끝나면 호출
  const handlePreparationEnd = () => {
    if (!isAnswering) {
      handleStartAnswering(); // 자동으로 답변 시작 상태로 전환
    }
  };
  
  const handleStartAnswering = () => {
    dispatch(startAnswering());
  };



  // 답변 종료 핸들러
  const handleStopAnswering = () => {
    dispatch(stopAnswering());

    // 다음 질문으로 이동
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(incrementQuestionIndex());
    } else {
      alert("모든 질문이 완료되었습니다.");
      dispatch(resetInterview()); // 면접이 끝나면 상태 초기화
      navigate("/ai/analyze"); // 분석 결과 페이지로 이동
    }
  };

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      alert("모든 질문이 완료되었습니다.");
      dispatch(resetInterview()); // 면접 완료 후 초기화
      navigate("/ai/analyze"); // 분석 결과 페이지로 이동
    }
  }, [currentQuestionIndex, questions.length, dispatch]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${
                    index <= currentQuestionIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 ${index < currentQuestionIndex ? "bg-blue-500" : "bg-gray-300"}`}></div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <section className="flex justify-center items-start space-x-16">
        <div className="w-1/2 max-w-md bg-white rounded-lg shadow-md p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-700">
              {interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}
            </span>
            <span className="text-gray-500 text-sm">
              <QuestionTimer 
                time={isAnswering ? answerTime : preparationTime} 
                onTimeEnd={isAnswering ? handleStopAnswering : handlePreparationEnd}
                label={isAnswering ? "답변 시간" : "준비 시간"}
              />
            </span>
          </div>

          <InterviewProcess 
            interviewType={interviewType} 
            interviewId={interviewId}
            currentQuestion={questions[currentQuestionIndex]}
            isAnswering={isAnswering}
          />
        </div>

        <div className="w-1/2">
          <section aria-labelledby="interview-question" className="mb-6">
            <h2 id="interview-question" className="text-xl font-semibold text-gray-900 mb-4">
              주어진 질문에 답변해 주세요.
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              🔥 {questions[currentQuestionIndex] || "모든 질문이 완료되었습니다."}
            </p>
            <p className="text-gray-500 text-lg mt-2">(질문)</p>
          </section>

          <div className="mt-8">
            {!isAnswering && currentQuestionIndex < questions.length ? (
              <button
                onClick={handleStartAnswering}
                className="w-full py-3 bg-teal-500 text-white rounded-lg text-lg hover:bg-teal-600 transition"
              >
                답변하기
              </button>
            ) : (
              isAnswering && (
                <button
                  onClick={handleStopAnswering}
                  className="w-full py-3 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600 transition"
                >
                  답변 종료
                </button>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default InterviewProcessPage;
