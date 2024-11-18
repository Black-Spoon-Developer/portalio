import React, { useEffect, useState } from "react";
import { getTop10Portfolios } from "../../../api/PortfolioAPI";
import { Portfolio } from "../../../interface/portfolio/PortfolioInterface";
import { useNavigate } from "react-router-dom";
import one from "../../../assets/1.png";
import two from "../../../assets/2.png";
import three from "../../../assets/3.png";
import norank from "../../../assets/4.png";

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
      <div className="shadow-lg border-2 rounded-md w-[17vw] h-[36vh] p-3">
        {portfolios.map((portfolio, index) => {
          // 순위에 따른 이미지 설정
          let imageSrc = norank;
          if (index === 0) imageSrc = one; // 1등
          else if (index === 1) imageSrc = two; // 2등
          else if (index === 2) imageSrc = three; // 3등

          return (
            <a
              key={portfolio.portfolioId}
              className="flex items-center truncate cursor-pointer mb-3"
              onClick={() => handlePortfolioClick(portfolio.portfolioId)} // 클릭 시 상세 페이지로 이동
            >
              {imageSrc && <img src={imageSrc} alt="" className="w-5 h-5 mr-2" />} {/* 순위에 따라 이미지 표시 */}
              <h2 className="text-sm">{portfolio.portfolioTitle}</h2>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default PopularPortfolio;
