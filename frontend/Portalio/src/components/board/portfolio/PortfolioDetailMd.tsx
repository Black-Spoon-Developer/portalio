import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPortfolioDetail } from "../../../api/BoardAPI";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./PortfolioDetailMd.css";

const PortfolioDetailMd: React.FC = () => {
  const { portfolioID } = useParams<{ portfolioID: string }>();
  const [portfolioContent, setPortfolioContent] = useState<string>("");

  useEffect(() => {
    // 더미 데이터를 사용하여 마크다운 콘텐츠 설정
    const fetchMarkdownContent = async () => {
      try {
        if (portfolioID) {
          // 포트폴리오 상세 조회 요청
          const response = await fetchPortfolioDetail(portfolioID);

          setPortfolioContent(response.data.portfolioContent);
        }
      } catch (error) {
        alert("글 조회를 실패했습니다.: " + error);
      }
    };

    fetchMarkdownContent();
  }, []);

  return (
    <>
      <div className="markdown-viewer p-6 rounded-lg border-2">
        <header>포트폴리오 제목</header>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {portfolioContent}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default PortfolioDetailMd;
