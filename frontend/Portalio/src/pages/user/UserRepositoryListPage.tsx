import React, { useState, useEffect } from "react";
import { getMyRepositoryList } from "../../api/RepositoryAPI";
import { useNavigate } from "react-router-dom";
import store, { RootState } from "../../store";

interface Repository {
  repositoryId: number; // 레포지토리 고유 ID
  repositoryTitle: string; // 레포지토리 제목
  repositoryContent: string; // 레포지토리 내용
  startDate: string; // 레포지토리 시작 날짜 (ISO 형식의 문자열)
  endDate: string; // 레포지토리 종료 날짜 (ISO 형식의 문자열)
  repositoryFileKey: string; // 파일 키 값 (파일에 대한 식별자)
  repositoryPost: boolean; // 게시 여부 (true: 게시됨, false: 비게시)
  memberId: number; // 레포지토리를 소유한 회원 ID
}

const UserRepositoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const state: RootState = store.getState();
        const username = state.auth.memberUsername;
        const response = await getMyRepositoryList(username || "");
        setRepositories(response.items);
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };

    fetchRepositories();
  }, []);

  const totalPages = Math.ceil(repositories.length / itemsPerPage);
  const paginatedRepos = repositories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          나의 레포지토리
        </h1>
        <button
          className="bg-sky-200 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-sky-300 transition"
          onClick={() => navigate("/repository/create")}
        >
          새 레포지토리
        </button>
      </header>

      {/* Repository List */}
      <ul className="space-y-4">
        {paginatedRepos.map((repo) => (
          <li
            key={repo.repositoryId}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-200"
            onClick={() => navigate(`/repository/${repo.repositoryId}`)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700 truncate">
                {truncateText(repo.repositoryTitle, 30)}
              </h2>
              <span
                className={`px-3 py-1 text-xs rounded-md ${
                  repo.repositoryPost
                    ? "bg-green-200 text-green-700"
                    : "bg-pink-200 text-pink-700"
                }`}
              >
                {repo.repositoryPost ? "Public" : "Private"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 truncate">
              {truncateText(repo.repositoryContent, 80)}
            </p>
            <div className="text-xs text-gray-500">
              {repo.startDate} ~ {repo.endDate}
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
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

export default UserRepositoryListPage;
