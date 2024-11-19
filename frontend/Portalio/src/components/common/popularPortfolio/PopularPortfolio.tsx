import React, { useEffect, useState } from "react";
import { getTop10Portfolios } from "../../../api/PortfolioAPI";
import { Portfolio } from "../../../interface/portfolio/PortfolioInterface";
import { useNavigate } from "react-router-dom";
import one from "../../../assets/1.png";
import two from "../../../assets/2.png";
import three from "../../../assets/3.png";
import norank from "../../../assets/4.png";
import view from "../../../assets/view.png";
import comment from "../../../assets/comment.png";
import good from "../../../assets/good.png";

const PopularPortfolio: React.FC = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [postsPerPage] = useState(3); // 한 페이지에 보여줄 항목 수

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

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage; // 마지막 포스트의 인덱스
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 첫 번째 포스트의 인덱스
  const currentPosts = portfolios.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 맞는 포스트들

  // 페이지 변경 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <header className="mb-3">🔥 인기 포트폴리오</header>
      <div className="shadow-lg border-2 rounded-md w-[17vw] p-3">
        {currentPosts.map((portfolio, index) => {
          // 순위에 따른 이미지 설정
          let imageSrc = norank;
          if (index === 0 && currentPage === 1) imageSrc = one; // 1등
          else if (index === 1 && currentPage === 1) imageSrc = two; // 2등
          else if (index === 2 && currentPage === 1) imageSrc = three; // 3등

          return (
            <div className="mb-3" key={portfolio.portfolioId}>
              <a
                onClick={() => handlePortfolioClick(portfolio.portfolioId)} // 클릭 시 상세 페이지로 이동
              >
                <div className="flex items-center truncate cursor-pointer">
                  {imageSrc && <img src={imageSrc} alt="" className="w-5 h-5 mr-2" />} {/* 순위에 따라 이미지 표시 */}
                  <h2 className="text-sm">{portfolio.memberNickname} 님의 포트폴리오</h2>
                </div>
                <div className="flex items-center cursor-pointer line-clamp-2">
                  <h2 className="text-base">{portfolio.portfolioTitle}</h2>
                </div>
                <div className="flex items-center justify-between cursor-pointer line-clamp-2">
                  <h2 className="text-sm text-gray-500">
                    {new Date(portfolio.created).toLocaleDateString("ko-KR")}
                  </h2>
                  <div className="flex space-x-1 text-sm text-gray-500 items-center">
                    <span className="flex items-center space-x-1">
                      <img src={comment} className="w-3 h-3" />
                      <span>{portfolio.portfolioCommentCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <img src={good} className="h-3" />
                      <span>{portfolio.portfolioRecommendationCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <img src={view} className="w-3 h-3" />
                      <span>{portfolio.portfolioViews}</span>
                    </span>
                  </div>
                </div>
              </a>
              <hr className="m-1"/>
            </div>
          );
        })}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-lg font-bold rounded-l"
          >
            &lt;
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(portfolios.length / postsPerPage)}
            className="px-4 py-2 text-lg font-bold rounded-r"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularPortfolio;
