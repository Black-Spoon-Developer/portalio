import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./UserProfilePage.css";
import ProfileImage from "../../../assets/ProfileImage.png"; // 프로필 이미지 경로
import BriefCase from "../../../assets/BriefCase.svg";
import FacebookIcon from "../../../assets/Facebook.svg";
import LinkedInIcon from "../../../assets/LinkedIn.svg";
import InstagramIcon from "../../../assets/Instagram.svg";
import GitHubIcon from "../../../assets/GitHub.svg";
import SettingsIcon from "../../../assets/Setting.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getMyPortfolios } from "../../../api/PortfolioAPI";
import { getMyBoards, getMyActivities } from "../../../api/BoardAPI";
import { getRepository, getMyRepositories } from "./../../../api/RepositoryAPI";

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

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  const years = [2023, 2024];
  const totalContributions = 1107;
  const dummyData = Array(52)
    .fill(null)
    .map(() => Array(7).fill(Math.floor(Math.random() * 2)));

  const username = useSelector((state: RootState) => state.auth.username);
  const picture = useSelector((state: RootState) => state.auth.picture);

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
          const repositoryResponse = await getMyRepositories(username);
          console.log("repositoryResponse: ", repositoryResponse);
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

  return (
    <div className="user-profile-page">
      {/* 프로필 및 이력 / 경력, 소셜 섹션 */}
      <div className="user-profile-container">
        <div className="profile-header">
          <img src={ProfileImage} alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h2 className="intro-title">🔥 끊임없이 도전하는 사람!</h2>
            <p className="intro-description">
              다양한 회사에서 많은 경험을 했습니다. 현재는 구직중이며 원하는
              회사는 많은 성장성과 도전정신이 있는 회사를 원합니다.
            </p>
            <p className="follow-info">300 팔로우 400 팔로잉</p>
          </div>
        </div>

        <div className="profile-content">
          <div className="career-section">
            <h3 className="career-title">이력 / 경력</h3>
            <ul className="career-list">
              {displayedCareers.map((career, index) => (
                <li className="career-item" key={index}>
                  <img
                    src={BriefCase}
                    alt="Briefcase Icon"
                    className="career-icon"
                  />
                  <div className="career-details">
                    <strong className="company-name">{career.company}</strong>
                    <span className="position-location">
                      {" "}
                      {career.position}
                    </span>
                    <br />
                    <span className="position-position">
                      {career.location}{" "}
                    </span>
                    <span className="duration">{career.duration}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="expand-button">
              {careerData.length > 3 && (
                <button onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "▲접기" : "▼펼치기"}
                </button>
              )}
            </div>
          </div>

          <div className="social-section">
            <h3>소셜</h3>
            <ul className="social-list">
              <li>
                <div className="social-item">
                  <img
                    src={FacebookIcon}
                    alt="Facebook"
                    className="social-icon"
                  />{" "}
                  <a href="">Facebook 링크</a>
                </div>
              </li>
              <li>
                <div className="social-item">
                  <img
                    src={LinkedInIcon}
                    alt="LinkedIn"
                    className="social-icon"
                  />{" "}
                  <a href="">LinkedIn 링크</a>
                </div>
              </li>
              <li>
                <div className="social-item">
                  <img
                    src={InstagramIcon}
                    alt="Instagram"
                    className="social-icon"
                  />{" "}
                  <a href="">Instagram 링크</a>
                </div>
              </li>

              <li>
                <div className="social-item">
                  <img src={GitHubIcon} alt="GitHub" className="social-icon" />{" "}
                  <a href="">GitHub 링크</a>
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
      <div className="portfolio-section !p-0">
        {/* header */}
        <div className="portfolio-header px-2 py-2">
          <h2>대표 포트폴리오</h2>
          <Link
            to={`/users/profile/${userId}/portfolio`}
            className="portfolio-settings-link"
          >
            <img
              src={SettingsIcon}
              alt="포트폴리오 관리"
              className="settings-icon"
            />
            포트폴리오 관리
          </Link>
        </div>
        {/* portfolio */}
        {portfolio && (
          <div className="block mt-4 min-h-[192px]">
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
                <span className="text-xl font-semibold">
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

      {/* 대표 레포지토리 및 작성한 게시글 섹션 */}
      <div className="repository-and-posts-section">
        {/* 대표 레포지토리 */}
        <div className="repository-section">
          <div className="section-header">
            <h2>대표 레포지토리</h2>
            <Link
              to={`/users/profile/${userId}/repository`}
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
                to={`/users/profile/${userId}/activity`}
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
              <Link to={`/users/profile/${userId}/free`} className="more-link">
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
                to={`/users/profile/${userId}/question`}
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
