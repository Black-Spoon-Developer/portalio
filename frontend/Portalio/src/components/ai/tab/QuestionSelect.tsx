import React, { useState } from "react";
import {
  PortfolioDTO,
  RepositoryDTO,
} from "../../../interface/aiInterview/AICommonInterface";
import { mainCategories, subCategories } from "../../../assets/JobCategory";

interface QuestionSelectProps {
  portfolios: PortfolioDTO[];
  repositories: RepositoryDTO[];
  onGenerate: (params: {
    selectedPortfolios: number[];
    selectedRepositories: number[];
    selectedJobs: string[];
  }) => void;
}

const QuestionSelect: React.FC<QuestionSelectProps> = ({
  portfolios,
  repositories,
  onGenerate,
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [selectedPortfolios, setSelectedPortfolios] = useState<number[]>([]);
  const [selectedRepositories, setSelectedRepositories] = useState<number[]>(
    []
  );

  const handlePortfolioToggle = (id: number) => {
    setSelectedPortfolios((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleRepositoryToggle = (id: number) => {
    setSelectedRepositories((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  const filteredSubCategories = selectedMainCategory
    ? subCategories.filter((sub) => sub.parentId === selectedMainCategory)
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col justify-center">
      <h1 className="text-5xl font-bold text-center mb-8">질문 생성</h1>

      <div className="grid grid-cols-2 gap-8 border-2 rounded-lg p-7 h-full ">
        {/* 왼쪽: 포트폴리오 & 레포지토리 선택 */}
        <div className="bg-white border-2 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">포트폴리오</h2>
          <div className="text-sm text-gray-500 mb-4">
            포트폴리오 또는 레포지토리를 체크해주세요
          </div>
          <div className="space-y-3">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.portfolio_id}
                className="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  checked={selectedPortfolios.includes(portfolio.portfolio_id)}
                  onChange={() => handlePortfolioToggle(portfolio.portfolio_id)}
                  className="w-4 h-4"
                />
                <span>{portfolio.portfolio_title}</span>
                {portfolio.portfolio_is_primary && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mt-6 mb-4">레포지토리</h2>
          <div className="space-y-3">
            {repositories.map((repository) => (
              <div
                key={repository.repository_id}
                className="flex items-center space-x-3"
              >
                <input
                  type="checkbox"
                  checked={selectedRepositories.includes(
                    repository.repository_id
                  )}
                  onChange={() =>
                    handleRepositoryToggle(repository.repository_id)
                  }
                  className="w-4 h-4"
                />
                <span>{repository.repository_title}</span>
                {repository.repository_is_primary && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 직무 선택 */}
        <div className="bg-white rounded-lg p-6 shadow-md border-2">
          <h2 className="text-2xl font-semibold mb-4">직무</h2>
          <div className="text-sm text-gray-500 mb-4">직무를 선택해주세요</div>

          <select
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => setSelectedMainCategory(Number(e.target.value))}
            value={selectedMainCategory || ""}
          >
            <option value="">직무 중분류 선택</option>
            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            value={selectedSubCategory || ""}
            disabled={!selectedMainCategory}
          >
            <option value="">직무 소분류 선택</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() =>
          onGenerate({
            selectedPortfolios,
            selectedRepositories,
            selectedJobs: selectedSubCategory ? [selectedSubCategory] : [],
          })
        }
        className="w-full mt-8 bg-cyan-400 text-white font-bold py-3 rounded-lg hover:bg-cyan-500 transition-colors"
        disabled={!selectedSubCategory}
      >
        면접 준비 하기
      </button>
    </div>
  );
};

export default QuestionSelect;
