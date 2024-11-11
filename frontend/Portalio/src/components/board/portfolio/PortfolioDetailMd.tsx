import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPortfolioDetail,
  portfolioDetailLike,
} from "../../../api/PortfolioAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./PortfolioDetailMd.css";

const PortfolioDetailMd: React.FC = () => {
  const navigate = useNavigate();

  const userID = BigInt(
    useSelector((state: RootState) => state.auth.memberId) ?? "0"
  );

  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const [portfolioContent, setPortfolioContent] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        if (portfolio_id) {
          const response = await fetchPortfolioDetail(portfolio_id);

          // 좋아요한 유저 목록에서 본인이 있는지 확인
          const isLikedByUser = await response.data.userPortfolioRecom.some(
            (recom: { memberId: bigint }) => recom.memberId === userID
          );

          setPortfolioContent(response.data.portfolioContent);
          setIsLiked(isLikedByUser);
        }
      } catch (error) {
        alert("글 조회를 실패했습니다.: " + error);
      }
    };

    fetchMarkdownContent();
  }, []);

  const handleLike = async () => {
    if (!portfolio_id) {
      alert("포트폴리오 ID가 없습니다.");
      return;
    }

    try {
      await portfolioDetailLike(portfolio_id);
      navigate(0);
    } catch (error) {
      alert("좋아요 처리 중 오류가 발생했습니다." + error);
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
    </div>
  );
};

export default PortfolioDetailMd;