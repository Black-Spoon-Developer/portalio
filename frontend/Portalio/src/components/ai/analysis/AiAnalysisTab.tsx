import React from "react";

interface Question {
  id: number;
  question: string;
}
interface AnalysisTabProps {
  questions: Question[];
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
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => onTabClick(q.id)}
          className={`px-4 py-2 text-md font-medium ${
            selectedTab === q.id ? " text-conceptSkyBlue" : "text-gray-600"
          }`}
        >
          질문 {q.id}
        </button>
      ))}
    </div>
  );
};

export default AiAnalysisTab;
