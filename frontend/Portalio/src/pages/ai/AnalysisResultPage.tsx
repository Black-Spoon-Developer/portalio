import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { interviewActions } from "../../store/interview/InterviewSlice";
import { useNavigate } from "react-router-dom";
import { getAnalysisResultApi } from "../../api/InterviewAPI";
import { RootState } from "../../store";
import { TimeSeriesData, ResultData, AnalysisResult } from "../../type/InterviewType";

const AnalysisResultPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태에서 인터뷰 ID와 분석 결과 가져오기
  const interviewId = useSelector((state: RootState) => state.interview.interviewId);
  const analysisResults = useSelector((state: RootState) => state.interview.analysisResults);

  useEffect(() => {
    const fetchAndSaveAnalysisResult = async () => {
      if (interviewId) {
        // API 호출 후 응답이 null 또는 undefined인지 확인
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
          Object.entries(analysisResults).map(([questionId, result]: [string, ResultData]) => (
            <div key={questionId} className="mb-8">
              <h3 className="text-xl font-semibold">질문 ID: {questionId}</h3>
              <p>현재 감정: {result.current_emotion}</p>
              <p>움직임 집중도: {result.movement_focus}%</p>
              <p>시선 집중도: {result.gaze_focus}%</p>

              <h4 className="mt-4 font-semibold">시간별 데이터</h4>
              <ul>
                {result.time_series_data?.map((data: TimeSeriesData, index: number) => (
                  <li key={index}>
                    시간: {data.time}, 감정: {data.emotion}, 
                    움직임 집중도: {data.movement_focus}%, 
                    시선 집중도: {data.gaze_focus}%
                  </li>
                ))}
              </ul>
            </div>
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
