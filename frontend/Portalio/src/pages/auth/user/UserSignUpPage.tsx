import React, { useState, useEffect } from "react";
import Logo from "../../../assets/Logo.png";
import {
  memberNicknameDuplicateCheckAPI,
  saveUserDetail,
  jobUpdate,
  authUser,
} from "../../../api/MemberAPI";
import { mainCategories, subCategories } from "../../../assets/JobCategory";
import { issueAccessToken } from "../../../api/AuthAPI";
import { UserInfo } from "../../../type/UserType";
import { useNavigate } from "react-router-dom";

// Category 타입 정의
type Category = {
  id: number;
  name: string;
  parentId?: number;
};

const UserSignupPage: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState(""); // 이메일 상태 추가
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    Category[]
  >([]);

  const navigate = useNavigate();

  useEffect(() => {
    setFilteredSubCategories(subCategories);
    const fetchData = async () => {
      // access 토큰 저장
      const fetchAccessToken = async () => {
        const isUserInfo = localStorage.getItem("userInfo");
        const accessToken = localStorage.getItem("access");

        if (!accessToken && !isUserInfo) {
          const response = await issueAccessToken();

          if (response) {
            const newAccessToken = response.data.access;
            localStorage.setItem("access", newAccessToken);

            // 유저 정보 저장
            const memberId = response.data.memberId.toString();
            const name = response.data.name;
            const username = response.data.username;
            const picture = response.data.picture;
            const role = response.data.role;

            const userInfo: UserInfo = {
              memberId,
              name,
              username,
              picture,
              role,
            };

            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
        }
      };

      await fetchAccessToken(); // access 토큰 가져오기
    };

    fetchData(); // 비동기 함수 실행
  }, []);

  // 닉네임 입력
  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  // 이메일 입력 핸들러
  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 닉네임 중복 체크
  const handleNicknameDuplicateCheck = async () => {
    try {
      const response = await memberNicknameDuplicateCheckAPI(nickname);
      const isDuplicateResult = response?.data.isDuplicate;

      setIsDuplicate(isDuplicateResult);
      alert(
        isDuplicate
          ? "이미 사용 중인 닉네임입니다."
          : "사용 가능한 닉네임입니다."
      );
    } catch (error) {
      console.log("닉네임 중복 에러", error);
    }
  };

  // 직무 대분류 선택
  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const mainCategoryId = e.target.value;
    setSelectedMainCategory(mainCategoryId);

    // 선택한 메인 카테고리에 해당하는 서브 카테고리만 필터링
    const filteredSubs = subCategories.filter(
      (sub) => sub.parentId === parseInt(mainCategoryId)
    );
    setFilteredSubCategories(filteredSubs);
  };

  // 직무 소분류 선택
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategory(e.target.value);
  };

  // 닉네임, 이메일, 직무 저장
  const infoUpdate = async () => {
    // 닉네임 중복 체크가 완료되었고, 직무 선택이 모두 완료된 경우
    if (
      !isDuplicate &&
      nickname &&
      email && // 이메일이 입력되었는지 확인
      selectedMainCategory &&
      selectedSubCategory
    ) {
      try {
        // 닉네임과 이메일을 함께 설정하는 API 호출
        const userInfoResponse = await saveUserDetail(nickname, email);
        if (userInfoResponse) {
          console.log("개인 회원 세부 정보 설정 성공:", userInfoResponse.data);
        }

        // 직무 저장 API 호출
        await jobUpdate(parseInt(selectedSubCategory));

        // 저장이 성공적으로 되면 user 인증 처리
        await authUser();

        alert("닉네임, 이메일과 직무가 성공적으로 저장되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("정보 업데이트 중 오류:", error);
      }
    } else {
      alert("닉네임 중복 체크와 직무 선택을 완료해 주세요.");
    }
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
                value={nickname}
                onChange={handleNicknameInput}
              />
              <button
                className="ml-3 px-4 h-14 text-lg font-bold text-white bg-conceptGreen hover:bg-hoverConceptGreen rounded-xl shadow-md"
                onClick={handleNicknameDuplicateCheck}
              >
                중복 체크
              </button>
            </div>
            <p className="mt-2 text-sm text-blue-500">
              비속어를 사용한 닉네임은 불가합니다.
            </p>
          </section>

          {/* 이메일 입력 */}
          <section className="w-2/3">
            <header className="text-3xl font-bold my-4">이메일</header>
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              className="w-full h-14 p-3 text-lg rounded-xl border-2"
              value={email}
              onChange={handleEmailInput}
            />
          </section>

          <section className="w-2/3 my-5">
            <header className="text-3xl font-bold my-4">직무</header>
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
            <select
              name="sub-category"
              className="w-full h-14 p-3 rounded-xl border-2"
              disabled={!selectedMainCategory}
              value={selectedSubCategory}
              onChange={handleSubCategoryChange}
            >
              <option value="">직무 소분류 선택</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </section>
          <button
            className="w-3/6 h-14 text-lg font-bold rounded-3xl shadow-md text-white bg-conceptSkyBlue hover:bg-hoverConceptSkyBlue"
            onClick={infoUpdate}
          >
            입력 완료
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserSignupPage;
