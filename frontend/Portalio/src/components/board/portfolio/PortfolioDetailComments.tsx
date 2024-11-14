import React from "react";
import { PortfolioCommetsResponse } from "../../../interface/portfolio/PortfolioInterface";

interface PortfolioDetailCommentsProps {
  comments: PortfolioCommetsResponse[];
}

const PortfolioDetailComments: React.FC<PortfolioDetailCommentsProps> = ({
  comments,
}) => {
  // 댓글 시간 포맷 함수
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `약 ${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `약 ${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `약 ${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `약 ${diffInDays}일 전`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `약 ${diffInMonths}달 전`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `약 ${diffInYears}년 전`;
  };

  return (
    <div className="border-2 rounded-lg shadow-md my-6 p-4">
      <header className="text-xl font-bold mb-4">댓글 {comments.length}</header>
      {comments.map((comment, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border rounded-lg mb-4"
        >
          <img
            src={comment.memberPicture || "https://via.placeholder.com/40"}
            alt={`${comment.memberNickname} 프로필 이미지`}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex items-center">
            <div className="font-semibold =">{comment.memberNickname}</div>
            <div className="mx-4 text-gray-400 text-sm">
              {formatTimeAgo(comment.created)}
            </div>
          </div>
          <div className="text-gray-700 tracking-wider">{comment.content}</div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioDetailComments;
