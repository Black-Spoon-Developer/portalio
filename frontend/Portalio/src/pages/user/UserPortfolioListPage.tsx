import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMyPortfolios } from "../../api/PortfolioAPI";
import { Link, useNavigate } from "react-router-dom";
import { Viewer } from "@toast-ui/react-editor";

interface Portfolio {
  portfolioId: number;
  portfolioTitle: string;
  portfolioContent: string;
  portfolioThumbnailImg: string;
  portfolioPost: boolean;
  created: Date;
  visibility: string;
  status: string;
}

const ITEMS_PER_PAGE = 5;

const UserPortfolioListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const username = useSelector((state: RootState) => state.auth.memberUsername);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (username && accessToken) {
      const fetchMyPortfolios = async () => {
        try {
          const response = await getMyPortfolios(username, 0, 1000); // 전체 포트폴리오 가져오기
          setPortfolios(response.data.items);
        } catch (error) {
          console.error("Failed to fetch portfolios:", error);
        }
      };
      fetchMyPortfolios();
    }
  }, [username, accessToken]);

  const totalPages = Math.ceil(portfolios.length / ITEMS_PER_PAGE);
  const paginatedPortfolios = portfolios.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? "bg-sky-300 text-white font-bold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">포트폴리오 관리</h1>
        <button
          className="bg-sky-200 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-sky-300 transition"
          onClick={() => navigate("/portfolio/create")}
        >
          작성
        </button>
      </header>

      <ul className="space-y-4">
        {paginatedPortfolios.map((portfolio) => (
          <Link
            to={`/portfolio/${portfolio.portfolioId}`}
            key={portfolio.portfolioId}
          >
            <li className="flex items-start p-4 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition">
              <img
                src={portfolio.portfolioThumbnailImg || "썸네일 이미지 URL"}
                alt="썸네일 이미지"
                className="w-48 h-32 rounded-md object-cover mr-6"
              />
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {truncateText(portfolio.portfolioTitle, 30)}
                  </h2>
                  <span
                    className={`px-3 py-1 text-xs rounded-md ${
                      portfolio.portfolioPost
                        ? "bg-green-200 text-green-700"
                        : "bg-pink-200 text-pink-700"
                    }`}
                  >
                    {portfolio.portfolioPost ? "Public" : "Private"}
                  </span>
                </div>

                <span className="text-xs text-gray-500">
                  생성일:{" "}
                  {new Date(portfolio.created).toISOString().slice(0, 10)}
                </span>
              </div>
              <div className="text-right text-green-600 font-semibold">
                {portfolio.status}
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserPortfolioListPage;
