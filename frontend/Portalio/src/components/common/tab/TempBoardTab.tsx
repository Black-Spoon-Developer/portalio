import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface TempBoardTabProps {
  user_id: string;
}

const TempBoardTab: React.FC<TempBoardTabProps> = () => {
  const { username } = useParams<{ username: string }>();

  const [selectedTab, setSelectedTab] = React.useState(0);
  const tabs = ["활동", "자유", "질문"];
  const navigate = useNavigate();
  const location = useLocation();

  // URL을 기반으로 selectedTab 설정
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("activity")) {
      setSelectedTab(0);
    } else if (path.includes("free")) {
      setSelectedTab(1);
    } else if (path.includes("question")) {
      setSelectedTab(2);
    }
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
    const paths = [
      `/users/profile/${username}/activity`,
      `/users/profile/${username}/free`,
      `/users/profile/${username}/question`,
    ];
    navigate(paths[index]);
  };

  return (
    <div className="bg-white flex justify-center border-b">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(index)}
          className={`mx-2 text-xl py-2 px-4 font-semibold ${
            selectedTab === index
              ? "text-[#57D4E2] border-b-2 border-[#57D4E2]"
              : "text-gray-500 hover:text-[#57D4E2]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TempBoardTab;
