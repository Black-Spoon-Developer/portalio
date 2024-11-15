import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./UserProfilePage.css";
import BriefCase from "../../assets/BriefCase.svg";
import FacebookIcon from "../../assets/Facebook.svg";
import LinkedInIcon from "../../assets/LinkedIn.svg";
import InstagramIcon from "../../assets/Instagram.svg";
import GitHubIcon from "../../assets/GitHub.svg";
import SettingsIcon from "../../assets/Setting.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMyPortfolios } from "../../api/PortfolioAPI";
import { getMyBoards, getMyActivities } from "../../api/BoardAPI";
import { getRepository, getMyRepositoryList } from "../../api/RepositoryAPI";

interface Free {
  boardId: number;
  boardTitle: string;
}

interface Activity {
  activityBoardId: number;
  activityBoardTitle: string;
  repositoryId: number;
  repositoryName: string;
}

interface Question {
  boardId: number;
  boardTitle: string;
}

interface Portfolio {
  created: Date;
  portfolioId: number;
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioIsPrimary: boolean;
  portfolioCommentCount: number;
  portfolioThumbnailImg: string;
  memberId: number;
  memberNickname: string;
}

interface Repository {
  repositoryId: number;
  repositoryTitle: string;
}

interface Career {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div
    className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={onClose}
  >
    <div
      className="modal-content bg-white p-4 rounded shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
      <button
        onClick={onClose}
        className="mt-4 text-right w-full htransition-all duration-200 flex leading-none"
      >
        닫기
      </button>
    </div>
  </div>
);

const UserProfilePage: React.FC = () => {
  // 페이지 기본 변수
  const { user_id } = useParams<{ user_id: string }>();
  const username = useSelector((state: RootState) => state.auth.memberUsername);

  // 프로필 사진 관련 변수
  const picture = useSelector((state: RootState) => state.auth.memberPicture);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 프로필 소개 관련 변수
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [introTitle, setIntroTitle] = useState("🔥 끊임없이 도전하는 사람!");
  const [introText, setIntroText] = useState(
    "다양한 회사에서 많은 경험을 했습니다. 현재는 구직중이며 원하는 회사는 많은 성장성과 도전정신이 있는 회사를 원합니다."
  );

  // 이력/경력 관련 변수
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [careers, setCareers] = useState<Career[]>([
    {
      company: "XYZ 주식회사",
      position: "인사팀장",
      startDate: "2022년 6월",
      endDate: "현재",
    },
    {
      company: "DEF 주식회사",
      position: "인사 담당자",
      startDate: "2020년 1월",
      endDate: "2022년 5월",
    },
    {
      company: "DEF 주식회사",
      position: "인사 담당자",
      startDate: "2020년 1월",
      endDate: "2022년 5월",
    },
    {
      company: "DEF 주식회사",
      position: "인사 담당자",
      startDate: "2020년 1월",
      endDate: "2022년 5월",
    },
  ]);

  const [newCareer, setNewCareer] = useState<Career>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
  });

  // 소셜 관련 변수
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    linkedin: "",
    instagram: "",
    github: "",
  });

  // 게시판 관련 변수
  const skip = 0;

  const limit = 2;
  const [frees, setFrees] = useState<Free[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Portfolio Repository
  const [portfolio, setPortfolio] = useState<Portfolio>();
  const [repositories, setRepositories] = useState<Repository[]>([]);

  // 프로필 소개 관련 함수
  const handleSaveIntro = () => {
    setIsEditingIntro(false);
    // 서버에 introTitle과 introText 저장 API 호출 가능
  };

  // Career 관련 함수
  const displayedCareers = isExpanded ? careers : careers.slice(0, 3);
  const handleCareerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCareer((prevCareer) => ({ ...prevCareer, [name]: value }));
  };

  const handleAddCareer = () => {
    setCareers([...careers, newCareer]);
    setNewCareer({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
    });
    setIsAdding(false);
  };

  // 소셜 관련 함수
  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prevLinks) => ({ ...prevLinks, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // 여기서 서버로 socialLinks를 저장하는 API 호출 추가 가능
    console.log("Social Links Saved:", socialLinks);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // 프로필 사진 클릭 시 선택 모달 열기
  const handleProfileClick = () => setIsModalOpen(true);

  const handleViewProfile = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(true);
  };

  // api 요청
  useEffect(() => {
    if (username) {
      const fetchMyInfos = async () => {
        try {
          const freesResponse = await getMyBoards(
            username,
            skip,
            limit,
            "FREE"
          );
          const questionsResponse = await getMyBoards(
            username,
            skip,
            limit,
            "QUESTION"
          );
          const activitiesResponse = await getMyActivities(
            username,
            skip,
            limit
          );
          const portfoliosResponse = await getMyPortfolios(username, 0, 100);
          const repositoryResponse = await getMyRepositoryList(username);
          const activitiesWithRepositoryNames = await Promise.all(
            activitiesResponse.data.items.map(async (activity: Activity) => {
              const repository = await getRepository(activity.repositoryId);
              return {
                ...activity,
                repositoryName: repository.repositoryTitle, // repository의 이름을 저장
              };
            })
          );

          setFrees(freesResponse.data.items);
          setQuestions(questionsResponse.data.items);
          setActivities(activitiesWithRepositoryNames);
          setRepositories(repositoryResponse.items.slice(0, 3));

          const primaryPortfolio = portfoliosResponse.data.items.find(
            (item: Portfolio) => item.portfolioIsPrimary == true
          );
          setPortfolio(primaryPortfolio);
        } catch (error) {
          console.error("Failed to fetch boards:", error);
        }
      };
      fetchMyInfos();
    }
  }, []);

  return (
    <div className="user-profile-page">
      {/* 프로필 및 이력 / 경력, 소셜 섹션 */}
      <div className="user-profile-container border-2 border-gray-400 p-5 rounded-md bg-white">
        <div className="profile-header flex items-center text-left mb-5 border-b border-gray-400 pb-5">
          <div className="relative mr-6 min-w-[200px]">
            {" "}
            {/* 오른쪽에 여백 추가 */}
            <img
              src={picture || "기본 이미지 URL"}
              alt="Profile"
              className="profile-image w-48 h-48 rounded-full cursor-pointer" // 둥근 이미지 모양 유지
            />
            <button
              className="absolute bottom-2 right-2 hover:bg-gray-300 bg-gray-200 text-gray-700 rounded-full inline-flex items-center justify-center w-10 h-10 text-xl transform transition duration-200"
              onClick={handleProfileClick}
            >
              📷
            </button>
          </div>

          {/* 선택 모달 */}
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <button
                className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded"
                onClick={handleViewProfile}
              >
                프로필 사진 보기
              </button>
              <input
                type="file"
                accept="image/*"
                className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    console.log("선택된 파일:", e.target.files[0]);
                    // 여기서 파일 업로드 처리 로직을 추가하세요
                  }
                }}
              />
            </Modal>
          )}

          {/* 프로필 사진 보기 모달 */}
          {isViewModalOpen && (
            <Modal onClose={() => setIsViewModalOpen(false)}>
              <img
                src={picture || "기본 이미지 URL"}
                alt="Profile"
                className="w-[600] h-[600px]"
              />
            </Modal>
          )}

          <div className="profile-info flex flex-col w-full">
            {/* 소개 제목과 수정 버튼 */}
            <div className="flex justify-between items-center mb-2 w-full">
              <div className="flex items-center w-full">
                {!isEditingIntro ? (
                  <h2 className="intro-title text-xl text-orange-500 font-bold flex-grow">
                    {introTitle}
                  </h2>
                ) : (
                  <input
                    type="text"
                    value={introTitle}
                    onChange={(e) => setIntroTitle(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="인트로 제목을 입력하세요"
                  />
                )}
              </div>
              {!isEditingIntro && (
                <button
                  onClick={() => setIsEditingIntro(true)}
                  className="flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1 transition duration-200 whitespace-nowrap"
                >
                  <img
                    src={SettingsIcon}
                    alt="수정 아이콘"
                    className="settings-icon w-5 h-5 mr-1"
                  />
                  수정
                </button>
              )}
            </div>

            {/* 소개 내용 */}
            <div className="flex flex-col mt-2 w-full">
              {!isEditingIntro ? (
                <p className="intro-description text-sm w-full">{introText}</p>
              ) : (
                <>
                  <textarea
                    value={introText}
                    onChange={(e) => setIntroText(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="소개 내용을 입력하세요"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={handleSaveIntro}
                      className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setIsEditingIntro(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      취소
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="profile-content flex">
          {/* 이력 / 경력 섹션 */}
          <div className="career-section w-1/2 pr-4 border-r border-gray-300">
            <div className="flex justify-between items-center mb-3">
              <h3 className="career-title text-lg font-semibold">
                이력 / 경력
              </h3>
              {!isAdding && (
                <button
                  className="flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1 transition duration-200"
                  onClick={() => setIsAdding(true)}
                >
                  <img
                    src={SettingsIcon}
                    alt="경력 관리 아이콘"
                    className="settings-icon w-6 h-6 mr-1"
                  />
                  경력 수정
                </button>
              )}
            </div>

            <ul className="career-list space-y-3">
              {displayedCareers.map((career, index) => (
                <li className="career-item flex items-start mb-4" key={index}>
                  <img
                    src={BriefCase}
                    alt="BriefCase Icon"
                    className="w-5 h-5 mr-2 mt-1"
                  />
                  <div className="career-details">
                    <div className="flex items-baseline">
                      <strong className="company-name font-bold">
                        {career.company}
                      </strong>
                      <span className="position-location ml-1">
                        {career.position}
                      </span>
                    </div>
                    <span className="duration text-gray-500">{`${career.startDate} ~ ${career.endDate}`}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* 경력 입력 폼 */}
            {isAdding && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  name="company"
                  placeholder="회사명"
                  value={newCareer.company}
                  onChange={handleCareerInputChange}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="position"
                  placeholder="직책"
                  value={newCareer.position}
                  onChange={handleCareerInputChange}
                  className="border p-2 rounded w-full"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="month"
                    name="startDate"
                    value={newCareer.startDate}
                    onChange={handleCareerInputChange}
                    className="border p-2 rounded w-1/2"
                  />
                  <span>~</span>
                  <input
                    type="month"
                    name="endDate"
                    value={newCareer.endDate}
                    onChange={handleCareerInputChange}
                    className="border p-2 rounded w-1/2"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleAddCareer}
                  >
                    추가
                  </button>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsAdding(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            <div className="expand-button mt-3 flex justify-center items-center">
              {careers.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-500"
                >
                  {isExpanded ? "▲ 접기" : "▼ 펼치기"}
                </button>
              )}
            </div>
          </div>

          {/* 소셜 섹션 */}
          <div className="social-section w-1/2 pl-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">소셜</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1 transition duration-200"
                >
                  <img
                    src={SettingsIcon}
                    alt="소셜 설정 아이콘"
                    className="settings-icon w-6 h-6 mr-1"
                  />
                  소셜 링크 수정
                </button>
              )}
            </div>
            <ul
              className={`social-list ${isEditing ? "space-y-4" : "space-y-6"}`}
            >
              <li className="flex items-center space-x-2">
                <img src={FacebookIcon} alt="Facebook" className="w-8 h-8" />
                {isEditing ? (
                  <input
                    type="text"
                    name="facebook"
                    value={socialLinks.facebook}
                    onChange={handleSocialInputChange}
                    placeholder="Facebook 링크"
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <a
                    href={socialLinks.facebook}
                    className="text-blue-800 hover:underline"
                  >
                    Facebook 링크
                  </a>
                )}
              </li>
              <li className="flex items-center space-x-2">
                <img src={LinkedInIcon} alt="LinkedIn" className="w-8 h-8" />
                {isEditing ? (
                  <input
                    type="text"
                    name="linkedin"
                    value={socialLinks.linkedin}
                    onChange={handleSocialInputChange}
                    placeholder="LinkedIn 링크"
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <a
                    href={socialLinks.linkedin}
                    className="text-blue-800 hover:underline"
                  >
                    LinkedIn 링크
                  </a>
                )}
              </li>
              <li className="flex items-center space-x-2">
                <img src={InstagramIcon} alt="Instagram" className="w-8 h-8" />
                {isEditing ? (
                  <input
                    type="text"
                    name="instagram"
                    value={socialLinks.instagram}
                    onChange={handleSocialInputChange}
                    placeholder="Instagram 링크"
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <a
                    href={socialLinks.instagram}
                    className="text-blue-800 hover:underline"
                  >
                    Instagram 링크
                  </a>
                )}
              </li>
              <li className="flex items-center space-x-2">
                <img src={GitHubIcon} alt="GitHub" className="w-8 h-8" />
                {isEditing ? (
                  <input
                    type="text"
                    name="github"
                    value={socialLinks.github}
                    onChange={handleSocialInputChange}
                    placeholder="GitHub 링크"
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <a
                    href={socialLinks.github}
                    className="text-blue-800 hover:underline"
                  >
                    GitHub 링크
                  </a>
                )}
              </li>
            </ul>
            {isEditing && (
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleSave}
                  className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 대표 포트폴리오 */}
      <div className="portfolio-section">
        <div className="border border-gray-300 rounded-lg">
          {/* header */}
          <div className="portfolio-header p-4">
            <h2>대표 포트폴리오</h2>
            <Link
              to={`/users/profile/${user_id}/portfolio`}
              className="portfolio-settings-link"
            >
              <img
                src={SettingsIcon}
                alt="포트폴리오 관리"
                className="settings-icon w-6 h-6"
              />
              포트폴리오 관리
            </Link>
          </div>
          {/* portfolio */}
          {portfolio && (
            <div className="block min-h-[192px]">
              <Link
                to={`/portfolio/${portfolio.portfolioId}`}
                className="flex items-start w-full px-2 py-2"
              >
                <div className="flex items-center">
                  <img
                    src={portfolio.portfolioThumbnailImg || "기본 이미지 URL"} // 썸네일 이미지 URL 설정
                    alt="대표 포트폴리오 썸네일"
                    className="w-48 h-48 rounded-md mr-4" // 이미지 크기 및 여백 설정
                  />
                </div>
                <div className="flex flex-col w-full justify-between  min-h-[192px]">
                  <span className="text-xl font-bold mb-3">
                    {portfolio.portfolioTitle}
                  </span>
                  <span className="text-sm line-clamp-3">
                    {portfolio.portfolioDescription}
                  </span>
                  <div className="text-sm text-gray-500 mt-auto self-end">
                    {portfolio.portfolioCommentCount}개의 댓글 ·{" "}
                    {new Date(portfolio.created)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\.$/, "")}
                  </div>
                </div>
              </Link>
              {/* Nickname */}
              <div className="border-t border-gray-300 py-2 text-right">
                <Link to={`/users/profile/${portfolio.memberId}`}>
                  <div className="py-2 px-2 flex items-center justify-end space-x-2">
                    <img
                      src={picture || ""}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="text-gray-500">by</span>
                    <span className="text-black font-bold">
                      {portfolio.memberNickname}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 대표 레포지토리 및 작성한 게시글 섹션 */}
      <div className="repository-and-posts-section">
        {/* 대표 레포지토리 */}
        <div className="repository-section">
          <div className="section-header">
            <h2>대표 레포지토리</h2>
            <Link
              to={`/users/profile/${user_id}/repository`}
              className="more-link"
            >
              더 보기 →
            </Link>
          </div>
          {repositories.length > 0 ? (
            repositories.map((repository, index) => (
              <div className="repository-item" key={index}>
                <Link to={`/repository/${repository.repositoryId}`}>
                  <h3>{repository.repositoryTitle}</h3>
                  <p>효율적인 인재 확보와 이직률 감소 사례</p>
                </Link>
              </div>
            ))
          ) : (
            <p>레포지토리가 없습니다</p>
          )}
        </div>

        {/* 작성한 게시글 */}
        <div className="posts-section">
          <h2>작성한 게시글</h2>
          <div className="post-category">
            <h3 className="post-title">
              활동 게시글{" "}
              <Link
                to={`/users/profile/${user_id}/activity`}
                className="more-link"
              >
                더 보기 →
              </Link>
            </h3>
            <ul>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <li key={activity.activityBoardId}>
                    <Link to={`/activity/${activity.activityBoardId}`}>
                      <span className="font-bold text-black">
                        [{activity.repositoryName}]
                      </span>{" "}
                      {activity.activityBoardTitle}
                    </Link>
                  </li>
                ))
              ) : (
                <li>작성한 활동 게시글이 없어요</li>
              )}
            </ul>
          </div>
          <div className="post-category">
            <h3 className="post-title">
              자유 게시글{" "}
              <Link to={`/users/profile/${user_id}/free`} className="more-link">
                더 보기 →
              </Link>
            </h3>
            <ul>
              {frees.length > 0 ? (
                frees.map((free) => (
                  <li key={free.boardId}>
                    <Link to={`/free/${free.boardId}`}>{free.boardTitle}</Link>
                  </li>
                ))
              ) : (
                <li>작성한 자유 게시글이 없어요</li>
              )}
            </ul>
          </div>
          <div className="post-category">
            <h3 className="post-title">
              질문 게시글{" "}
              <Link
                to={`/users/profile/${user_id}/question`}
                className="more-link"
              >
                더 보기 →
              </Link>
            </h3>
            <ul>
              {questions.length > 0 ? (
                questions.map((question) => (
                  <li key={question.boardId}>
                    <Link to={`/question/${question.boardId}`}>
                      {question.boardTitle}
                    </Link>
                  </li>
                ))
              ) : (
                <li>작성한 질문 게시글이 없어요</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
