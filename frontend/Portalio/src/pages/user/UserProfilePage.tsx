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

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
    <div className="modal-content bg-white p-4 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
      {children}
      <button onClick={onClose} className="mt-4 text-right w-full text-blue-500 hover:text-blue-700">
        닫기
      </button>
    </div>
  </div>
);

const UserProfilePage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const username = useSelector((state: RootState) => state.auth.username);
  const picture = useSelector((state: RootState) => state.auth.picture);

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  const years = [2023, 2024];
  const totalContributions = 1107;
  const dummyData = Array(52)
    .fill(null)
    .map(() => Array(7).fill(Math.floor(Math.random() * 2)));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [frees, setFrees] = useState<Free[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio>();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const skip = 0;
  const limit = 2;

  // api 요청
  useEffect(() => {
    if (username) {
      const fetchMyBoards = async () => {
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
          console.log("repositoryResponse: ", repositoryResponse);
          const activitiesWithRepositoryNames = await Promise.all(
            activitiesResponse.data.items.map(async (activity: Activity) => {
              const repository = await getRepository(activity.repositoryId);
              console.log("단일 응답:", repository);
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
      fetchMyBoards();
    }
  }, []);

  // 이력 경력 더미 데이터
  const careerData = [
    {
      company: "XYZ 주식회사",
      position: "인사팀장",
      location: "서울특별시",
      duration: "2022년 6월 ~ 현재",
    },
    {
      company: "DEF 주식회사",
      position: "인사 담당자",
      location: "서울특별시",
      duration: "2020년 1월 ~ 2022년 5월",
    },
    {
      company: "ABC 주식회사",
      position: "인사 신입사원",
      location: "서울특별시",
      duration: "2018년 3월 ~ 2019년 12월",
    },
    {
      company: "GHI 주식회사",
      position: "인사 매니저",
      location: "부산광역시",
      duration: "2017년 1월 ~ 2018년 2월",
    },
  ];

  // 표시할 이력 데이터 (3개까지만 표시하고, 펼치기 버튼 클릭 시 전체 표시)
  const displayedCareers = isExpanded ? careerData : careerData.slice(0, 3);

  // 프로필 사진 클릭 시 선택 모달 열기
  const handleProfileClick = () => setIsModalOpen(true);

  const handleViewProfile = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(true);
  };

  const handleUploadProfile = () => {
    setIsModalOpen(false);
    setIsUploadModalOpen(true);
  };

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
              onClick={handleProfileClick}
            />
            <button
              className="change-profile-button absolute bottom-2 right-2 bg-gray-700 text-white rounded px-2 py-1"
              onClick={handleProfileClick}
            >
              변경
            </button>
          </div>

          {/* 선택 모달 */}
          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <button className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded" onClick={handleViewProfile}>
                프로필 사진 보기
              </button>
              <button className="w-full text-left mb-2 hover:bg-gray-100 p-2 rounded">
                프로필 사진 선택
              </button>
            </Modal>
          )}

          {/* 프로필 사진 보기 모달 */}
          {isViewModalOpen && (
            <Modal onClose={() => setIsViewModalOpen(false)}>
              <img
                src={picture || "기본 이미지 URL"}
                alt="Profile"
                className="w-[500px] h-[500px]"
              />
            </Modal>
          )}

          {/* 사진 업로드 모달 */}
          {isUploadModalOpen && (
            <Modal onClose={() => setIsUploadModalOpen(false)}>
              <div>
                <h2>프로필 사진 업로드</h2>
                <input type="file" accept="image/*" />
                <button className="upload-button">업로드</button>
              </div>
            </Modal>
          )}

          <div className="profile-info flex flex-col">
            <h2 className="intro-title text-xl text-orange-500 font-bold mb-2">
              🔥 끊임없이 도전하는 사람!
            </h2>
            <p className="intro-description text-sm mb-1">
              다양한 회사에서 많은 경험을 했습니다. 현재는 구직중이며 원하는
              회사는 많은 성장성과 도전정신이 있는 회사를 원합니다.
            </p>
            <p className="follow-info text-sm text-gray-600">
              300 팔로우 400 팔로잉
            </p>
          </div>
        </div>

        <div className="profile-content flex">
          {/* 이력 / 경력 섹션 */}
          <div className="career-section w-1/2 pr-4 border-r border-gray-300">
            <h3 className="career-title text-lg font-semibold mb-3">
              이력 / 경력
            </h3>
            <ul className="career-list space-y-3">
              {displayedCareers.map((career, index) => (
                <li className="career-item" key={index}>
                  <div className="career-details">
                    <strong className="company-name font-bold">
                      {career.company}
                    </strong>
                    <span className="position-location ml-1">
                      {career.position}
                    </span>
                    <br />
                    <span className="position-location text-gray-500">
                      {career.location}
                    </span>
                    <span className="duration text-gray-500">
                      {career.duration}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="expand-button mt-3 flex justify-center items-center">
              {careerData.length > 3 && (
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
            <h3 className="text-lg font-semibold mb-3">소셜</h3>
            <ul className="social-list space-y-6">
              <li>
                <div className="social-item flex items-center space-x-2">
                  <img src={FacebookIcon} alt="Facebook" className="w-8 h-8" />
                  <a href="" className="text-blue-800 hover:underline">
                    Facebook 링크
                  </a>
                </div>
              </li>
              <li>
                <div className="social-item flex items-center space-x-2">
                  <img src={LinkedInIcon} alt="LinkedIn" className="w-8 h-8" />
                  <a href="" className="text-blue-800 hover:underline">
                    LinkedIn 링크
                  </a>
                </div>
              </li>
              <li>
                <div className="social-item flex items-center space-x-2">
                  <img
                    src={InstagramIcon}
                    alt="Instagram"
                    className="w-8 h-8"
                  />
                  <a href="" className="text-blue-800 hover:underline">
                    Instagram 링크
                  </a>
                </div>
              </li>
              <li>
                <div className="social-item flex items-center space-x-2">
                  <img src={GitHubIcon} alt="GitHub" className="w-8 h-8" />
                  <a href="" className="text-blue-800 hover:underline">
                    GitHub 링크
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 활동 내역 잔디 섹션 */}
      <div className="activity-section">
        <div className="activity-header">
          <h3>
            {totalContributions} contributions in {selectedYear}
          </h3>
          <div className="year-selector">
            {years.map((year) => (
              <button
                key={year}
                className={`year-button ${
                  selectedYear === year ? "active" : ""
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        <div className="activity-grid">
          {dummyData.map((week, i) => (
            <div key={i} className="week">
              {week.map((day, j) => (
                <div
                  key={j}
                  className={`day ${day ? "active" : ""}`}
                  title={day ? "활동" : "휴식"}
                />
              ))}
            </div>
          ))}
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
