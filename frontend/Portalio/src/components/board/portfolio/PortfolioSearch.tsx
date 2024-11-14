import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IoMdRefresh } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import { mainCategories, subCategories } from "../../../assets/JobCategory";

interface PortfolioSearchProps {
  onSearch: (term: string, subCategory: number | null) => void;
  onReset: () => void;
}

const PortfolioSearch: React.FC<PortfolioSearchProps> = ({
  onSearch,
  onReset,
}) => {
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");
  // 메인 카테고리 상태
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);
  // 서브 카테고리 상태
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );

  // 검색어 핸들러 함수
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 메인 카테고리 선택 핸들러 함수
  const handleMainCategoryChange = (event: SelectChangeEvent<number>) => {
    const mainCategoryId = Number(event.target.value);
    setSelectedMainCategory(mainCategoryId);
    setSelectedSubCategory(null); // 메인 카테고리가 변경될 때 서브 카테고리 초기화
  };

  // 서브 카테고리 핸들러 함수
  const handleSubCategoryChange = (event: SelectChangeEvent<number>) => {
    setSelectedSubCategory(Number(event.target.value));
  };

  // 카테고리 필터
  const filteredSubCategories = subCategories.filter(
    (subCategory) => subCategory.parentId === selectedMainCategory
  );

  // 검색 핸들러 함수
  const handleSearch = () => {
    onSearch(searchTerm, selectedSubCategory);
  };

  // 리셋 핸들러 함수
  const handleReset = () => {
    setSearchTerm("");
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    onReset();
  };

  return (
    <div className="p-4">
      <Accordion>
        <AccordionSummary
          expandIcon={<IoIosArrowDropdown />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div className="font-bold">포트폴리오 검색</div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="mb-4">
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <Select
              value={selectedMainCategory || ""}
              onChange={handleMainCategoryChange}
              displayEmpty
              className="w-full"
            >
              <MenuItem value="" disabled>
                중분류 선택
              </MenuItem>
              {mainCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {selectedMainCategory && (
            <div className="mb-4">
              <Select
                value={selectedSubCategory || ""}
                onChange={handleSubCategoryChange}
                displayEmpty
                className="w-full"
              >
                <MenuItem value="" disabled>
                  소분류 선택
                </MenuItem>
                {filteredSubCategories.map((subCategory) => (
                  <MenuItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={handleSearch} className="btn-primary font-bold">
              검색
            </button>
            <button
              onClick={handleReset}
              className="flex items-center btn-secondary font-bold"
            >
              <div className="mr-2">전체글 조회</div>
              <IoMdRefresh />
            </button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default PortfolioSearch;
