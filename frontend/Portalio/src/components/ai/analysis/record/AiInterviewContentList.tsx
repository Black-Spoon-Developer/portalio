import React from "react";

const AiInterviewContentList: React.FC = () => {
  // 카드 데이터를 배열로 관리
  const cardData = [
    {
      rank: "개선필요",
      title: "포트폴리오 제목",
      jobType: "직무 종류",
      date: "수행 날짜",
      icon: "📷", // 아이콘은 이모지 또는 이미지 URL로 대체 가능
    },
    {
      rank: "우수",
      title: "포트폴리오 제목",
      jobType: "직무 종류",
      date: "수행 날짜",
      icon: "🎙️",
    },
    {
      rank: "우수",
      title: "포트폴리오 제목",
      jobType: "직무 종류",
      date: "수행 날짜",
      icon: "🖥️",
    },
    {
      rank: "우수",
      title: "포트폴리오 제목",
      jobType: "직무 종류",
      date: "수행 날짜",
      icon: "💬",
    },
  ];

  return (
    <div className="space-y-4 p-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
        >
          {/* 헤더 - 평가 등급 대신 날짜 넣기 */}
          <div className="bg-gradient-to-r from-conceptSkyBlue to-conceptGreen text-white p-4">
            <h3 className="text-lg font-semibold">평가 등급: {card.rank}</h3>
          </div>

          {/* 내용 */}
          <div className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{card.title}</p>
              <p className="text-sm text-gray-500">{card.jobType}</p>
              <p className="text-sm text-gray-500">{card.date}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>

          {/* 푸터 */}
          <div className="p-4 border-t text-right">
            <a
              href="#"
              className="text-blue-500 hover:underline text-sm font-medium flex items-center justify-end"
            >
              상세 페이지{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AiInterviewContentList;
