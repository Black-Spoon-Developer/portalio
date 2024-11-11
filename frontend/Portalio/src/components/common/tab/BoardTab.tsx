import React from "react";

interface BoardTabProps {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const BoardTab: React.FC<BoardTabProps> = ({ selectedTab, setSelectedTab }) => {
  const tabs = ["포트폴리오", "활동", "자유", "질문"];

  return (
    <div className="bg-white flex justify-center">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setSelectedTab(index)}
          className={`mx-4 mt-10 text-md text-conceptGrey py-2 px-4 font-semibold ${
            selectedTab === index
              ? "text-conceptSkyBlue border-b-2 border-conceptSkyBlue"
              : "hover:text-conceptSkyBlue"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default BoardTab;
