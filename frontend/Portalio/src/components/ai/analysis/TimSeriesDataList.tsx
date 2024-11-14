// TimeSeriesDataList.tsx
import React from "react";
import { TimeSeriesData } from "../../../type/InterviewType";

interface TimeSeriesDataListProps {
  timeSeriesData?: TimeSeriesData[];
}

const TimeSeriesDataList: React.FC<TimeSeriesDataListProps> = ({ timeSeriesData }) => {
  if (!timeSeriesData) return null;

  return (
    <ul>
      {timeSeriesData.map((data, index) => (
        <li key={index}>
          시간: {data.time}, 감정: {data.emotion}, 
          움직임 집중도: {data.movement_focus}%, 
          시선 집중도: {data.gaze_focus}%
        </li>
      ))}
    </ul>
  );
};

export default TimeSeriesDataList;
