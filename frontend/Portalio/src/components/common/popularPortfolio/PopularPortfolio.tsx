import React, { useEffect, useState } from "react";
import { getTop10Portfolios } from "../../../api/PortfolioAPI"
import { Portfolio } from "../../../interface/portfolio/PortfolioInterface";
import { useNavigate } from "react-router-dom";

const PopularPortfolio: React.FC = () => {
  const navigate = useNavigate();
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

  const handlePortfolioClick = (portfolioId: number) => {
    // 포트폴리오 상세 페이지로 이동
    navigate(`/portfolio/${portfolioId}`);
  };

  return (
    <div>
      <header className="mb-3">🔥 오늘의 인기 포트폴리오</header>
      <div>
        {portfolios.map((portfolio) => (
          <p
            key={portfolio.portfolioId}
            className="shadow-lg border-2 rounded-md w-[14vw] h-[36vh] p-4 flex flex-col justify-between"
            onClick={() => handlePortfolioClick(portfolio.portfolioId)} // 클릭 시 상세 페이지로 이동
          >
            <h2 className="text-lg font-semibold">{portfolio.portfolioTitle}</h2>
          </p>
        ))}
      </div>
      <div className="shadow-lg border-2 rounded-md w-[14vw] h-[36vh]"></div>
    </div>
  );
};

export default PopularPortfolio;
