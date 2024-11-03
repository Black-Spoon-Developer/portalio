import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../../../assets/Logo.png";

const UserSignupPage: React.FC = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(() => {
    // 메인 및 서브 카테고리 데이터 가져오기
    const fetchCategories = async () => {
      try {
        const mainResponse = await axios.get(
          "https://oapi.saramin.co.kr/guide/main-category-url"
        );
        const subResponse = await axios.get(
          "https://oapi.saramin.co.kr/guide/sub-category-url"
        );

        setMainCategories(mainResponse.data);
        setSubCategories(subResponse.data);
      } catch (error) {
        console.error("카테고리 데이터 가져오기 오류:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // 선택된 중분류에 따라 소분류 필터링
    const filtered = subCategories.filter(
      (sub) => sub.parentId === selectedMainCategory
    );
    setFilteredSubCategories(filtered);
  }, [selectedMainCategory, subCategories]);

  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMainCategory(e.target.value);
  };

  return (
    <div className="my-8">
      {/* 로고 */}
      <section className="">
        <div className="flex justify-center">
          <img src={Logo} alt="no-image" className="w-1/5" />
        </div>
      </section>
      {/* 정보 입력 박스 */}
      <section className="flex justify-center">
        <div className="flex flex-col items-center border-2 p-8 rounded-lg w-2/3 bg-white shadow-md my-8">
          {/* 닉네임 입력 */}
          <section className="w-2/3">
            <header className="text-3xl font-bold my-4">닉네임</header>
            <div className="flex">
              <input
                type="text"
                placeholder="닉네임을 입력해주세요."
                className="w-full h-14 p-3 text-lg rounded-xl border-2"
              />
              <button className="ml-3 px-4 h-14 text-lg font-bold text-white bg-conceptGreen hover:bg-hoverConceptGreen rounded-xl shadow-md">
                중복 체크
              </button>
            </div>
            <p className="mt-2 text-sm text-blue-500">
              비속어를 사용한 닉네임은 불가합니다.
            </p>
          </section>
          {/* 직무 선택 */}
          <section className="w-2/3 my-5">
            <header className="text-3xl font-bold my-4">직무</header>
            {/* 중분류 선택 */}
            <select
              name="main-category"
              className="w-full h-14 p-3 mb-3 rounded-xl border-2"
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
            >
              <option value="">직무 중분류 선택</option>
              {mainCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {/* 소분류 선택 */}
            <select
              name="sub-category"
              className="w-full h-14 p-3 rounded-xl border-2"
              disabled={!selectedMainCategory}
            >
              <option value="">직무 소분류 선택</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </section>
          <button className="w-3/6 h-14 text-lg font-bold rounded-3xl shadow-md text-white bg-conceptSkyBlue hover:bg-hoverConceptSkyBlue">
            입력 완료
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserSignupPage;
