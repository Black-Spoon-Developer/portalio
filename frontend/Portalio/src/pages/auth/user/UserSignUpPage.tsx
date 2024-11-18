import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../../assets/Logo.png";
import {
  memberNicknameDuplicateCheckAPI,
  saveUserDetail,
  jobUpdate,
  authUser,
} from "../../../api/MemberAPI";
import { mainCategories, subCategories } from "../../../assets/JobCategory";
import { issueAccessToken } from "../../../api/AuthAPI";
import { UserInfo, UserDetailInfo } from "../../../type/UserType";
import { authActions } from "../../../store/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { userTicketUpdate } from "../../../api/TicketAPI";

// Category 타입 정의
type Category = {
  id: number;
  name: string;
  parentId?: number;
};

const UserSignupPage: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    Category[]
  >([]);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      // access 토큰 발급 후
      const fetchAccessToken = async () => {
        if (accessToken == null) {
          const response = await issueAccessToken();

          if (response) {
            const newAccessToken = response.data.access;

            // accessToken을 발급받았을 경우
            if (newAccessToken) {
              let memberAuth: boolean = false;

              if (response.data.auth === "1") {
                memberAuth = true;
              }

              // 로그인을 통해 유저 정보 저장
              const userInfo: UserInfo = {
                accessToken: newAccessToken,
                memberId: response.data.memberId,
                memberName: response.data.name,
                memberUsername: response.data.username,
                memberNickname: response.data.nickname,
                memberPicture: response.data.picture,
                memberRole: response.data.role,
                memberTicket: 0,
                memberAuth: memberAuth,
                memberJob: response.data.jobSubCategoryId,
              };

              dispatch(authActions.login(userInfo));
            }
          }
        }
      };
      setFilteredSubCategories(subCategories);
      await fetchAccessToken(); // access 토큰 가져오기
    };

    fetchData(); // 비동기 함수 실행
  }, []);

  // 닉네임 입력
  const handleNicknameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
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

  // 닉네임, 직무 저장
  const infoUpdate = async () => {
    // 닉네임 중복 체크가 완료되었고, 직무 선택이 모두 완료된 경우
    if (
      !isDuplicate &&
      nickname &&
      selectedMainCategory &&
      selectedSubCategory
    ) {
      try {
        // 닉네임과 직무 정보 설정하는 API 호출
        const userInfoResponse = await saveUserDetail(nickname);
        if (!userInfoResponse) {
          alert("에러가 발생했습니다.");
          return;
        }

        // 직무 저장 API 호출
        await jobUpdate(parseInt(selectedSubCategory));

        // 저장이 성공적으로 되면 user 인증 처리
        await authUser();

        // 회원 정보를 저장했으므로 티켓 5개를 지급 - test 시 100개
        await userTicketUpdate(100);

        // storage 값도 변경하기
        dispatch(authActions.successMemberAuth());
        // 저장 후 memberNickname과 memberJob 저장하기
        const userDetailInfo: UserDetailInfo = {
          memberNickname: nickname,
          memberJob: selectedSubCategory,
        };

        dispatch(authActions.setUserInfo(userDetailInfo));

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
    <div className="my-8 min-h-screen">
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
                className="ml-3 px-4 h-14 text-lg font-bold text-white bg-conceptGreen hover:bg-hoverConceptGreen rounded-xl shadow-md whitespace-nowrap"
                onClick={handleNicknameDuplicateCheck}
              >
                중복 체크
              </button>
            </div>
            <p className="mt-2 text-sm text-blue-500">
              비속어를 사용한 닉네임은 불가합니다.
            </p>
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
