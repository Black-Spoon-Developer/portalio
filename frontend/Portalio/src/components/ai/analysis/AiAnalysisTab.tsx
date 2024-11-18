interface AnalysisTabProps<T> {
  questions?: T[];
  selectedTab: number;
  onTabClick: (id: number) => void;
}

const AiAnalysisTab = <T extends { content?: string }>({
  questions,
  selectedTab,
  onTabClick,
}: AnalysisTabProps<T>) => {
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
