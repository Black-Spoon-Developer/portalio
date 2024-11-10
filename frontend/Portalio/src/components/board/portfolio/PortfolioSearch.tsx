import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { IoIosArrowDropdown } from "react-icons/io";

const categories = [
  { id: 1, name: "기획·전략" },
  { id: 2, name: "마케팅·홍보·조사" },
  { id: 3, name: "회계·세무·재무" },
  { id: 4, name: "인사·노무·HRD" },
  { id: 5, name: "총무·법무·사무" },
  { id: 6, name: "IT개발·데이터" },
  { id: 7, name: "디자인" },
  { id: 8, name: "영업·판매·무역" },
  { id: 9, name: "구매·자재·물류" },
  { id: 10, name: "상품기획·MD" },
  { id: 11, name: "생산" },
  { id: 12, name: "건설·건축" },
  { id: 13, name: "의료" },
  { id: 14, name: "연구·R&D" },
  { id: 15, name: "교육" },
  { id: 16, name: "미디어·문화·스포츠" },
  { id: 17, name: "금융·보험" },
  { id: 18, name: "공공·복지" },
];

const PortfolioSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id);
  };

  return (
    <div className="p-4">
      <Accordion>
        <AccordionSummary
          expandIcon={<IoIosArrowDropdown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div>포트폴리오 검색</div>
        </AccordionSummary>
        <AccordionDetails>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="원하는 검색어를 입력해주세요."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md relative"
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-2 border rounded-md ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Selected Category Display */}
          {selectedCategory && (
            <div className="mt-4">
              <p>
                선택된 카테고리:{" "}
                {categories.find((cat) => cat.id === selectedCategory)?.name}
              </p>
            </div>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PortfolioSearch;
