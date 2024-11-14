// AnalysisResultPage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { interviewActions } from "../../../store/interview/InterviewSlice";
import { useNavigate } from "react-router-dom";
import { getAnalysisResultApi } from "../../../api/InterviewAPI";
import { RootState } from "../../../store";
import { AnalysisResult } from "../../../type/InterviewType";
import QuestionAnalysisResult from "../../../components/ai/analysis/QuestionAnalysisResult";

const AnalysisResultPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const interviewId = useSelector((state: RootState) => state.interview.interviewId);
  const analysisResults = useSelector((state: RootState) => state.interview.analysisResults);

  useEffect(() => {
    const fetchAndSaveAnalysisResult = async () => {
      if (interviewId) {
        const result: AnalysisResult | undefined = await getAnalysisResultApi(interviewId);
        if (result && typeof result === "object") {
          Object.entries(result).forEach(([questionId, analysisResult]) => {
            dispatch(interviewActions.saveAnalysisResult({
              questionId: parseInt(questionId),
              result: analysisResult,
            }));
          });
        } else {
          console.error("Failed to fetch analysis results or received invalid data:", result);
        }
      }
    };

    fetchAndSaveAnalysisResult();
  }, [dispatch, interviewId]);

  const handleRestart = () => {
    dispatch(interviewActions.resetInterview());
    navigate("/interview/1");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">분석 결과</h2>
        {analysisResults && Object.keys(analysisResults).length > 0 ? (
          Object.entries(analysisResults).map(([questionId, result]) => (
            <QuestionAnalysisResult key={questionId} questionId={questionId} result={result} />
          ))
        ) : (
          <p>분석 결과를 불러오는 중...</p>
        )}
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
