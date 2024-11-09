import React from "react";
import { useState } from "react";

const BoardTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ["포트폴리오", "활동", "자유", "질문"];

  return (
    <>
      <div className="bg-white flex justify-center">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={`mx-2 text-xl text-conceptGrey py-2 px-4 font-semibold  ${
              selectedTab === index
                ? "text-conceptSkyBlue border-b-2 border-conceptSkyBlue"
                : "hover:text-conceptSkyBlue"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
};

export default BoardTab;
