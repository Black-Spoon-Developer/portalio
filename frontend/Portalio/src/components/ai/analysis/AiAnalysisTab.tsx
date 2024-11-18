import React from "react";
import { Question } from "../../../interface/aiInterview/AudioInterviewInterface";

interface AnalysisTabProps {
  questions?: Question[];
  selectedTab: number;
  onTabClick: (id: number) => void;
}

const AiAnalysisTab: React.FC<AnalysisTabProps> = ({
  questions,
  selectedTab,
  onTabClick,
}) => {
  return (
    <div className="flex space-x-4 mb-4">
      {questions?.map((_, index) => (
        <button
          key={index}
          onClick={() => onTabClick(index)}
          className={`px-4 py-2 text-md font-medium ${
            selectedTab === index ? " text-conceptSkyBlue" : "text-gray-600"
          }`}
        >
          질문 {index + 1}
        </button>
      ))}
    </div>
  );
};

export default AiAnalysisTab;
