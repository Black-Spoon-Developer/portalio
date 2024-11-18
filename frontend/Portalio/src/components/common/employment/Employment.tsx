import React, { useEffect, useState } from "react";
import { getJobOpening } from "../../../api/AiInterview";
import { EmploymentResponse } from "../../../type/EmploymentType";
import { mainCategories, subCategories } from "../../../assets/JobCategory";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import defaultImg1 from "../../../assets/employ1.jpg";
import defaultImg2 from "../../../assets/employ2.jpg";
import defaultImg3 from "../../../assets/employ3.jpg";
import defaultImg4 from "../../../assets/employ4.jpg";
import defaultImg5 from "../../../assets/employ5.jpg";
import defaultImg6 from "../../../assets/employ6.jpg";
import defaultImg7 from "../../../assets/employ7.jpg";
import defaultImg8 from "../../../assets/employ8.jpg";

// 랜덤 이미지 선택
const defaultImages = [defaultImg1, defaultImg2, defaultImg3, defaultImg4, defaultImg5, defaultImg6, defaultImg7, defaultImg8];
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * defaultImages.length);
  return defaultImages[randomIndex];
};

// ID로 subCategory 이름 찾기
const findSubCategoryName = (id: number) => {
  const category = subCategories.find((cat) => cat.id === id);
  return category ? category.name : null; // 항목이 없으면 null 반환
};

const Employment: React.FC = () => {
  const [jobData, setJobData] = useState<EmploymentResponse[]>([]);
  const [jobCategory, setJobCategory] = useState<number[]>([1]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchJobOpening = async () => {
      setLoading(true); // 로딩 시작
      try {
        const response = await getJobOpening(jobCategory);
        setJobData(response);
      } catch (error) {
        console.error("채용정보 불러오기 오류:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };
    fetchJobOpening();
  }, [jobCategory]);

  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);

  const handleMainCategoryChange = (event: SelectChangeEvent<number>) => {
    const mainCategoryId = Number(event.target.value);
    setSelectedMainCategory(mainCategoryId);
  };

  const handleSubCategoryChange = (event: SelectChangeEvent<number>) => {
    setJobCategory([Number(event.target.value)]);
  };

  const filteredSubCategories = subCategories.filter(
    (subCategory) => subCategory.parentId === selectedMainCategory
  );

  return (
    <div className="grid grid-cols-12 my-20">
      <div className="col-span-1"></div>
      <div className="col-span-10">
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
              value={jobCategory[0]}
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
        
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <LoadingSpinner mode="Getting"/>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 p-4">
          {jobData.length === 0 ? (
            <div className="text-center text-gray-500">채용 정보가 없습니다.</div>
          ) : (
            jobData.map((job, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 mb-5 relative">
                <img
                  src={getRandomImage()}
                  alt="Default"
                  className="w-full h-40 mb-2 object-cover"
                />
                <div className="px-4">
                  <h2 className="text-xl font-semibold">{job.recrutPbancTtl}</h2>
                  <p className="text-sm">{job.instNm}</p>
                  <a href={job.srcUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                    채용 공고 보기
                  </a>
                  <p className="text-gray-700 text-sm">지역: {job.workRgnNmLst}</p>
                  <p className="text-gray-700 text-sm">채용: {job.recrutSeNm}</p>
                  <p className="text-gray-700 text-sm">{job.pbancBgngYmd} ~ {job.pbancEndYmd}</p>
                  <div className="flex flex-wrap gap-2 my-4">
                    {job.jobCategories.map((categoryId, idx) => {
                      const categoryName = findSubCategoryName(categoryId);
                      return categoryName ? (
                        <span key={idx} className="bg-gray-300 text-gray-700 px-4 py-1 rounded-xl text-sm">
                          {categoryName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}
        </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default Employment;
