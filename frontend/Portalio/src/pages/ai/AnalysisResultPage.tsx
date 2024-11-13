// src/pages/analysis/AnalysisPage.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { interviewActions } from "../../store/interview/InterviewSlice";
import { useNavigate } from "react-router-dom";

const AnalysisResultPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRestart = () => {
    dispatch(interviewActions.resetInterview());
    navigate("/interview/1"); // 첫 번째 질문 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 분석 결과 표시 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">분석 결과</h2>
        {/* 분석 결과 내용을 여기에 추가 */}
        <button
          onClick={handleRestart}
          className="mt-8 py-2 px-4 bg-blue-500 text-white rounded-lg"
        >
          다시하기
        </button>
      </div>
    </div>
  );
};

export default AnalysisResultPage;
