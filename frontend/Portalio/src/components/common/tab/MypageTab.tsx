import React from "react";
import { useState } from "react";

const MypageTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = ["프로필", "내 포트폴리오", "레포지토리", "내 게시글", "설정"];

  return (
    <div className="flex justify-center bg-white border-b border-gray-200 ">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setSelectedTab(index)}
          className={`mx-2 text-xl text-conceptGrey py-2 px-4 font-semibold  ${
            selectedTab === index
              ? "text-conceptSkyBlue border-b-2 border-[#57D4E2]"
              : "hover:text-conceptSkyBlue"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default MypageTab;
