import React, { useEffect, useState } from "react";
import { getTop10Portfolios } from "../../../api/PortfolioAPI"
import { Portfolio } from "../../../interface/portfolio/PortfolioInterface";

const PopularPortfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchTop10Portfolio = async () => {

        try {
          const response = await getTop10Portfolios();
          setPortfolios(response.items);
        } catch (error) {
          console.error("레포지토리 리스트 불러오기 오류:", error);
        }

    };
    fetchTop10Portfolio();
  }, []);

  return (
    <div>
      <header className="mb-3">🔥 오늘의 인기 포트폴리오</header>
      <div className="grid grid-cols-2 gap-4">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.portfolioId}
            className="shadow-lg border-2 rounded-md w-[14vw] h-[36vh] p-4 flex flex-col justify-between"
          >
            <div>
              <img
                src={portfolio.portfolioThumbnailImg}
                alt={portfolio.portfolioTitle}
                className="w-full h-[60%] object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold">{portfolio.portfolioTitle}</h2>
            </div>
            <div className="text-sm text-gray-500">
              조회수: {portfolio.portfolioViews} | 추천: {portfolio.portfolioRecommendationCount} | 댓글: {portfolio.portfolioCommentCount}
            </div>
          </div>
        ))}
      </div>
      <div className="shadow-lg border-2 rounded-md w-[14vw] h-[36vh]"></div>
    </div>
  );
};

export default PopularPortfolio;
