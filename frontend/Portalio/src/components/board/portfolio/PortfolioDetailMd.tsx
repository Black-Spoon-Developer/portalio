import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPortfolioDetail } from "../../../api/BoardAPI";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./PortfolioDetailMd.css";

const PortfolioDetailMd: React.FC = () => {
  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const [portfolioContent, setPortfolioContent] = useState<string>("");
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        if (portfolio_id) {
          const response = await fetchPortfolioDetail(portfolio_id);
          setPortfolioContent(response.data.portfolioContent);
          setLikes(response.data.likes);
          setIsLiked(response.data.isLiked);
        }
      } catch (error) {
        alert("글 조회를 실패했습니다.: " + error);
      }
    };

    fetchMarkdownContent();
  }, [portfolio_id]);

  const handleLike = async () => {
    try {
      setIsLiked((prev) => !prev);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      // 실제 API 호출 필요 시 이 줄 활성화
      // await likePortfolio(portfolio_id);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="markdown-viewer p-6 rounded-lg border-2 relative">
      <header className="flex justify-between items-center">
        <h1>포트폴리오 제목</h1>
        <button
          onClick={handleLike}
          className={`flex items-center justify-center p-2 rounded-full text-xl ${
            isLiked ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          style={{ width: "40px", height: "40px" }}
        >
          ❤️
        </button>
      </header>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {portfolioContent}
      </ReactMarkdown>
      <div className="mt-4 text-gray-600">{likes}명이 좋아합니다</div>
    </div>
  );
};

export default PortfolioDetailMd;
