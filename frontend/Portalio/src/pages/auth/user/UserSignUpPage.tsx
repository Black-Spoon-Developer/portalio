// import React, { useState, useEffect } from "react";
// import Logo from "../../../assets/Logo.png";
// import { fetchUserInfo } from "../../../api/auth/LoginAPI";

// const UserSignupPage: React.FC = () => {
//   // 중분류 및 소분류 데이터를 하드코딩합니다.
//   const mainCategories = [
//     { id: 1, name: "기획·전략" },
//     { id: 2, name: "마케팅·홍보·조사" },
//     { id: 3, name: "회계·세무·재무" },
//     { id: 4, name: "인사·노무·HRD" },
//     { id: 5, name: "총무·법무·사무" },
//     { id: 6, name: "IT개발·데이터" },
//     { id: 7, name: "디자인" },
//     { id: 8, name: "영업·판매·무역" },
//     { id: 9, name: "구매·자재·물류" },
//     { id: 10, name: "상품기획·MD" },
//     // 추가 중분류 항목들...
//   ];

//   const subCategories = [
//     { id: 1, name: "리스크 관리", parentId: 1 },
//     { id: 2, name: "경영관리", parentId: 1 },
//     { id: 3, name: "CSO", parentId: 1 },
//     { id: 4, name: "CIO", parentId: 1 },
//     { id: 5, name: "기획", parentId: 1 },
//     { id: 6, name: "게임기획", parentId: 1 },
//     // 추가 소분류 항목들...
//     { id: 71, name: "라이센싱", parentId: 2 },
//     { id: 72, name: "PPL", parentId: 2 },
//     { id: 130, name: "행정사", parentId: 3 },
//     // 전체 데이터를 추가합니다.
//   ];

//   const [selectedMainCategory, setSelectedMainCategory] = useState("");
//   const [filteredSubCategories, setFilteredSubCategories] = useState([]);

//   useEffect(() => {
//     // URL에서 access 토큰을 추출
//     const urlParams = new URLSearchParams(window.location.search);
//     const accessToken = urlParams.get("access");
//     if (accessToken) {
//       // access 토큰을 localStorage에 저장
//       localStorage.setItem("access", accessToken);

//       // URL에서 access 파라미터 제거
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     // 회원 정보 조회 및 저장
//     fetchUserInfo();
//   }, []);

//   const handleMainCategoryChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedMainCategory(e.target.value);
//   };

//   return (
//     <div className="my-8">
//       {/* 로고 */}
//       <section className="">
//         <div className="flex justify-center">
//           <img src={Logo} alt="no-image" className="w-1/5" />
//         </div>
//       </section>
//       {/* 정보 입력 박스 */}
//       <section className="flex justify-center">
//         <div className="flex flex-col items-center border-2 p-8 rounded-lg w-2/3 bg-white shadow-md my-8">
//           {/* 닉네임 입력 */}
//           <section className="w-2/3">
//             <header className="text-3xl font-bold my-4">닉네임</header>
//             <div className="flex">
//               <input
//                 type="text"
//                 placeholder="닉네임을 입력해주세요."
//                 className="w-full h-14 p-3 text-lg rounded-xl border-2"
//               />
//               <button className="ml-3 px-4 h-14 text-lg font-bold text-white bg-conceptGreen hover:bg-hoverConceptGreen rounded-xl shadow-md">
//                 중복 체크
//               </button>
//             </div>
//             <p className="mt-2 text-sm text-blue-500">
//               비속어를 사용한 닉네임은 불가합니다.
//             </p>
//           </section>
//           {/* 직무 선택 */}
//           <section className="w-2/3 my-5">
//             <header className="text-3xl font-bold my-4">직무</header>
//             {/* 중분류 선택 */}
//             <select
//               name="main-category"
//               className="w-full h-14 p-3 mb-3 rounded-xl border-2"
//               value={selectedMainCategory}
//               onChange={handleMainCategoryChange}
//             >
//               <option value="">직무 중분류 선택</option>
//               {mainCategories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//             {/* 소분류 선택 */}
//             <select
//               name="sub-category"
//               className="w-full h-14 p-3 rounded-xl border-2"
//               disabled={!selectedMainCategory}
//             >
//               <option value="">직무 소분류 선택</option>
//               {filteredSubCategories.map((sub) => (
//                 <option key={sub.id} value={sub.id}>
//                   {sub.name}
//                 </option>
//               ))}
//             </select>
//           </section>
//           <button className="w-3/6 h-14 text-lg font-bold rounded-3xl shadow-md text-white bg-conceptSkyBlue hover:bg-hoverConceptSkyBlue">
//             입력 완료
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default UserSignupPage;
