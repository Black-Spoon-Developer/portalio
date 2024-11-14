// QuestionAnalysisResult.tsx
import React from "react";
import { ResultData } from "../../../type/InterviewType";
import TimeSeriesDataList from "./TimSeriesDataList";

interface QuestionAnalysisResultProps {
  questionId: string;
  result: ResultData;
}

const QuestionAnalysisResult: React.FC<QuestionAnalysisResultProps> = ({ questionId, result }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold">질문 ID: {questionId}</h3>
      <p>현재 감정: {result.current_emotion}</p>
      <p>움직임 집중도: {result.movement_focus}%</p>
      <p>시선 집중도: {result.gaze_focus}%</p>

      <h4 className="mt-4 font-semibold">시간별 데이터</h4>
      <TimeSeriesDataList timeSeriesData={result.time_series_data} />
    </div>
  );
};

export default QuestionAnalysisResult;
