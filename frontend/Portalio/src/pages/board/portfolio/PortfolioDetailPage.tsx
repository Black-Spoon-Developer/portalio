import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PortfolioDetailMd from "../../../components/board/portfolio/PortfolioDetailMd";
import PortfolioDetailComments from "../../../components/board/portfolio/PortfolioDetailComments";
import SideNavBar from "../../../components/common/navBar/SideNavBar";
import PortfolioDetailCommentsInput from "../../../components/board/portfolio/PortfolioDetailCommentsInput";
import PortfolioDetailPdf from "../../../components/board/portfolio/PortfolioDetailPdf";
import { fetchPortfolioDetail } from "../../../api/PortfolioAPI";

const PortfolioDetailPage: React.FC = () => {
  const { portfolio_id } = useParams<{ portfolio_id: string }>();
  const [portfolioContent, setPortfolioContent] = useState<string>("");

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        if (portfolio_id) {
          const response = await fetchPortfolioDetail(portfolio_id);
          setPortfolioContent(response.data.portfolioContent);
        }
      } catch (error) {
        alert("글 조회를 실패했습니다.: " + error);
      }
    };

    fetchMarkdownContent();
  }, []);

  return (
    <div className="grid grid-cols-5 min-h-screen">
      <div className="fixed top-48 left-0 h-full">
        <SideNavBar />
      </div>
      <div className="col-span-1"></div>
      <div className="mx-5 my-8 col-span-3">
        <PortfolioDetailMd portfolioContent={portfolioContent} />
        <PortfolioDetailCommentsInput />
        <PortfolioDetailComments />
      </div>
      <div className="col-span-1">
        <PortfolioDetailPdf portfolioContent={portfolioContent} />
      </div>
    </div>
  );
};

export default PortfolioDetailPage;
