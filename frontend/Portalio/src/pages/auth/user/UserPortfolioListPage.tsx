import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getMyPortfolios } from "../../../api/PortfolioAPI";
import { Link, useNavigate } from "react-router-dom";

interface Portfolio {
  portfolioId: number;
  portfolioTitle: string;
  portfolioContent: string;
  portfolioThumbnailImg: string;
  portfolioPost: boolean;
  createdDate: string;
  visibility: string;
  status: string;
}

const ITEMS_PER_PAGE = 10;

const UserPortfolioListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const username = useSelector((state: RootState) => state.auth.username);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();


  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = ITEMS_PER_PAGE;

  useEffect(() => {
    if (username && accessToken) {
      const fetchMyPortfolios = async () => {
        try {
          const response = await getMyPortfolios(
            username,
            skip,
            limit,
          );
          setPortfolios(response.data.items);
        } catch (error) {
          console.error("Failed to fetch portfolios:", error);
        }
      };
      fetchMyPortfolios();
    }
  }, [username, accessToken, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">포트폴리오 관리</h1>
        <button
          className="bg-[#57D4E2] text-white py-2 px-4 rounded-md font-semibold"
          onClick={() => navigate("/portfolio/create")}
        >
          작성
        </button>
      </div>
      <div className="bg-white">
        <ul>
          {portfolios.map((portfolio) => (
            <Link
              to={`/portfolio/${portfolio.portfolioId}`}
              key={portfolio.portfolioId}
            >
              <li className="flex items-center p-4 border-b-2">
                <img
                  src={portfolio.portfolioThumbnailImg || "썸네일 이미지 URL"}
                  alt="썸네일 이미지"
                  className="w-80 h-36 mr-6 rounded-md bg-gray-200"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h2 className="text-lg font-bold mr-2">
                      {portfolio.createdDate} {portfolio.portfolioTitle}
                    </h2>
                    <span
                      className={`text-sm font-semibold rounded px-2 py-1 ${
                        portfolio.visibility === "Public"
                          ? "bg-blue-200 text-blue-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {portfolio.visibility}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    {portfolio.portfolioContent}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-semibold">
                    {portfolio.status}
                  </span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {[1, 2, 3, "...", 67, 68].map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-[#57D4E2] text-white font-semibold"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserPortfolioListPage;
