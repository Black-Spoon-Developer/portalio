import React from "react";
import { MdOutlineCreate } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface BoardTabProps {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const BoardTab: React.FC<BoardTabProps> = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();
  const tabs = ["포트폴리오", "활동", "자유", "질문"];

  // 각 Tab에 따른 URL을 설정하는 함수
  const getUrlByTab = () => {
    switch (selectedTab) {
      case 0:
        return "/portfolio/create";
      case 1:
        return "/activity/create";
      case 2:
        return "/free/create";
      case 3:
        return "/question/create";
      default:
        return "/"; // 기본 URL
    }
  };

  // 글 작성 페이지로 가는 핸들러 함수
  const handleCreateClick = () => {
    const url = getUrlByTab();
    navigate(url);
  };

  return (
    <div className="flex justify-between items-center w-full px-4 relative">
      <div className="flex justify-center bg-white">
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
      <button
        onClick={handleCreateClick}
        className="absolute right-5 bottom-1 flex items-center bg-blue-500 text-white p-1 rounded-lg hover:bg-blue-600"
      >
        <MdOutlineCreate className="size-4 mr-3" />{" "}
        <div className="font-bold tracking-wider">작 성</div>
      </button>
    </div>
  );
};

export default BoardTab;
