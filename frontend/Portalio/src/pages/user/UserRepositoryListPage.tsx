import React, { useState, useEffect } from "react";
import "./UserRepositoryListPage.css";
import { getMyRepositoryList } from "../../api/RepositoryAPI";
import { useNavigate } from "react-router-dom";
import store, { RootState } from "../../store";

interface Repository {
  repositoryId: number; // 레포지토리 고유 ID
  repositoryTitle: string; // 레포지토리 제목
  repositoryContent: string; // 레포지토리 내용
  startDate: string; // 레포지토리 시작 날짜 (ISO 형식의 문자열)
  endDate: string; // 레포지토리 종료 날짜 (ISO 형식의 문자열)
  repositoryFileKey: string; // 파일 키 값 (파일에 대한 식별자)
  repositoryPost: boolean; // 게시 여부 (true: 게시됨, false: 비게시)
  memberId: number; // 레포지토리를 소유한 회원 ID
}

// UserRepositoryPage 컴포넌트: 레포지토리 목록과 활동 그래프를 표시
const UserRepositoryListPage: React.FC = () => {
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const state: RootState = store.getState();
        const username = state.auth.username;
        const response = await getMyRepositoryList(username || '');
        console.log("Repository List:", response); // 응답 콘솔에 출력
        setRepositories(response.items); // 상태에 응답 데이터 저장
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
      }
    };

    fetchRepositories();
  }, []);

  // 페이지 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 5; // 페이지당 표시할 레포지토리 수

  // 하이라이트와 관련된 상태 관리
  const [highlightedDays, setHighlightedDays] = useState<number[][]>([]); // 하이라이트할 날짜 위치 배열
  const [highlightColor, setHighlightColor] = useState<string>(""); // 랜덤으로 적용할 하이라이트 색상

  // 연도 및 활동 상태 관리
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 선택된 연도
  const [years, setYears] = useState<number[]>([]); // 활동이 있는 연도 목록
  const [totalContributions, setTotalContributions] = useState(0); // 총 활동 일수 계산

  // 파스텔 색상 배열: 하이라이트 효과에 사용할 색상들
  const pastelColors = [
    "#FFA07A",
    "#FFB6C1",
    "#FF6F61",
    "#E6A57E",
    "#8FBC8F",
    "#7DAFC9",
  ];


  // 전체 레포지토리 목록의 총 활동 일수를 계산하는 함수
  const calculateTotalContributions = () => {
    let contributions = 0; // 총 기여도 초기화
    repositories.forEach((repo) => {
      const startDate = new Date(repo.startDate); // 각 레포지토리의 시작일과 종료일을 Date 객체로 변환
      const endDate = new Date(repo.endDate); // 각 레포지토리의 시작일과 종료일을 Date 객체로 변환
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1
      ); // 시작일과 종료일 사이의 일수를 계산
      contributions += days; // 계산한 일수를 총 기여도에 추가
    });
    setTotalContributions(contributions); // 최종 총 기여도를 상태에 저장
  };

  // 레포지토리들이 포함된 연도만 추출하는 함수
  const extractYearsWithActivity = () => {
    const activityYears = new Set<number>(); // 중복 제거를 위해 Set 사용
    repositories.forEach((repo) => {
      const startDate = new Date(repo.startDate); // 각 레포지토리의 시작일과 종료일 가져오기
      const endDate = new Date(repo.endDate); // 각 레포지토리의 시작일과 종료일 가져오기
      activityYears.add(startDate.getFullYear()); // 시작일의 연도 추가
      activityYears.add(endDate.getFullYear()); // 종료일의 연도 추가
    });
    setYears(Array.from(activityYears).sort()); // 연도 목록을 배열로 변환하고 정렬하여 상태에 저장
  };

  // 컴포넌트가 처음 렌더링될 때 총 기여도와 활동 연도를 추출
  useEffect(() => {
    calculateTotalContributions(); // 활동 일수 계산 함수 실행
    extractYearsWithActivity(); // 활동 연도 추출 함수 실행
  }, []);

  // 선택된 연도에 맞는 더미 활동 데이터를 생성하는 함수
  const getDummyData = (year: number) => {
    const weeksInYear = 52;
    const data = Array(weeksInYear)
      .fill(null)
      .map(() => Array(7).fill(0)); // 52주 X 7일 배열 초기화

    repositories.forEach((repo) => {
      const startDate = new Date(repo.startDate);
      const endDate = new Date(repo.endDate);
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // 시작일부터 종료일까지 반복
        const dayOfYear = Math.floor(
          (currentDate.getTime() - new Date(year, 0, 1).getTime()) /
            (1000 * 60 * 60 * 24)
        ); // 연도 시작일부터 현재 날짜까지의 일수를 구함
        const weekIndex = Math.floor(dayOfYear / 7); // 일수를 7로 나누어 해당 주 계산
        const dayIndex = (currentDate.getDay() + 6) % 7; // 요일을 인덱스로 변환 (월요일 시작)

        if (weekIndex >= 0 && weekIndex < data.length && dayIndex >= 0) {
          data[weekIndex][dayIndex] = 1; // 해당 주의 요일에 활동 표시
        }
        currentDate.setDate(currentDate.getDate() + 1); // 날짜를 하루씩 증가
      }
    });

    return data; // 생성된 주별 요일 활동 데이터를 반환
  };

  // 더미 활동 데이터 및 페이지네이션 관련 설정
  const dummyData = getDummyData(selectedYear); // 현재 선택된 연도에 대한 활동 데이터 생성
  const totalPages = Math.ceil(repositories.length / itemsPerPage); // 총 페이지 수 계산
  const paginatedRepos = repositories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); // 현재 페이지에 표시할 레포지토리 리스트

  // 페이지 변경 핸들러 함수
  const handlePageChange = (page: number) => setCurrentPage(page);

  // 특정 레포지토리 날짜 범위 위에 마우스를 올렸을 때 해당 날짜 범위를 하이라이트
  const handleMouseEnter = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const highlighted = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      // 시작일부터 종료일까지 반복
      const dayOfYear = Math.floor(
        (currentDate.getTime() - new Date(selectedYear, 0, 1).getTime()) /
          (1000 * 60 * 60 * 24)
      ); // 선택된 연도의 첫날로부터 일수 계산
      const weekIndex = Math.floor(dayOfYear / 7); // 주 인덱스 계산
      const dayIndex = (currentDate.getDay() + 6) % 7; // 요일을 인덱스로 변환

      if (weekIndex < dummyData.length && dayIndex >= 0) {
        highlighted.push([weekIndex, dayIndex]); // 하이라이트 배열에 추가
      }
      currentDate.setDate(currentDate.getDate() + 1); // 날짜 하루씩 증가
    }

    setHighlightedDays(highlighted); // 하이라이트 날짜 저장
    setHighlightColor(
      pastelColors[Math.floor(Math.random() * pastelColors.length)]
    ); // 랜덤 하이라이트 색상 선택
  };

  // 마우스를 떠날 때 하이라이트 해제
  const handleMouseLeave = () => setHighlightedDays([]);

  // 페이지 번호를 렌더링하는 함수
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2); // 현재 페이지 기준으로 앞뒤 페이지 번호 계산
    const endPage = Math.min(totalPages, startPage + 4); // 마지막 페이지가 totalPages를 넘지 않도록 제한

    for (let page = startPage; page <= endPage; page++) {
      pageNumbers.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={page === currentPage ? "active" : ""}
        >
          {page}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="repository-list-page">
      {/* 헤더 섹션 */}
      <header className="page-header">
        <h1>레포지토리 목록</h1>
        <button
          className="create-button"
          onClick={() => navigate("/repository/create")}
        >
          생성
        </button>
      </header>

      {/* 레포지토리 목록 섹션 */}
      <ul className="repository-list">
        {paginatedRepos.map((repo, index) => (
          <li
            key={index}
            className="repository-item"
            onClick={() => navigate(`/repository/${repo.repositoryId}`)}
            onMouseEnter={() => handleMouseEnter(repo.startDate, repo.endDate)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="repository-content">
              <div className="title-row">
                <h2 className="repository-title">{repo.repositoryTitle}</h2>
                <span
                  className={`visibility-badge ${repo.repositoryPost
                    .toString()
                    .toLowerCase()}`}
                >
                  {repo.repositoryPost ? "public" : "private"}
                </span>
              </div>

              <div className="repository-date">
                {repo.startDate} ~ {repo.endDate}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 활동 섹션 */}
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

        {/* 활동 월 표시 */}
        <div className="months">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>

        {/* 활동 그래프 */}
        <div className="activity-grid">
          <div className="left-box">
            <p>Mon</p>
            <p>Wed</p>
            <p>Fri</p>
          </div>

          {/* 더미 데이터(주별 요일별 활동) 순회 */}
          {dummyData.map((week, weekIndex) => (
            <div key={weekIndex} className="week">
              {week.map((day, dayIndex) => {
                // `isHighlighted`는 현재 요일이 하이라이트 대상인지 여부
                const isHighlighted = highlightedDays.some(
                  ([highlightedWeek, highlightedDay]) =>
                    highlightedWeek === weekIndex && highlightedDay === dayIndex
                ); // 현재 주와 요일 인덱스가 하이라이트 대상인지 확인

                return (
                  <div
                    key={dayIndex}
                    className={`day ${isHighlighted ? "highlighted" : ""}`} // 하이라이트 여부에 따라 클래스 설정
                    style={{
                      backgroundColor: isHighlighted
                        ? highlightColor // 하이라이트인 경우 랜덤 파스텔색상
                        : day > 0 // 활동이 있는 날(day > 0)이면 연한 녹색
                        ? "#A5D6A7"
                        : "#e0e0e0", // 활동이 없는 날은 회색
                    }}
                    title={day ? "활동" : "휴식"} // 활동 여부에 따라 툴팁 표시
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 섹션 */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "hidden-button" : ""}
        >
          이전
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "hidden-button" : ""}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default UserRepositoryListPage;
