import React from "react";

interface Comment {
  username: string;
  profileImage: string;
  content: string;
  timestamp: string;
}

const PortfolioDetailComments: React.FC = () => {
  const comment: Comment = {
    username: "HK-98",
    profileImage: "https://via.placeholder.com/40", // 예시 이미지 URL
    content: "훌륭한 포트폴리오네요!",
    timestamp: "2024.10.29 10:16:23",
  };

  return (
    <div className="border-2 rounded-lg shadow-md my-6 p-4">
      <header className="text-lg font-bold mb-4">댓글 1</header>
      <div className="flex items-center space-x-4 p-4 border rounded-lg">
        <img
          src={comment.profileImage}
          alt={`${comment.username} 프로필 이미지`}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{comment.username}</p>
          <p className="text-gray-700">{comment.content}</p>
        </div>
        <span className="ml-auto text-gray-400 text-sm">
          {comment.timestamp}
        </span>
      </div>
    </div>
  );
};

export default PortfolioDetailComments;
