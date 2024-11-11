import React, { useState, useEffect } from "react";
import "./UserRepositoryListPage.css";

// UserRepositoryPage 컴포넌트: 레포지토리 목록과 활동 그래프를 표시
const UserRepositoryListPage: React.FC = () => {
  // 페이지 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 3; // 페이지당 표시할 레포지토리 수
  
  // 하이라이트와 관련된 상태 관리
  const [highlightedDays, setHighlightedDays] = useState<number[][]>([]); // 하이라이트할 날짜 위치 배열
  const [highlightColor, setHighlightColor] = useState<string>(""); // 랜덤으로 적용할 하이라이트 색상
  
  // 연도 및 활동 상태 관리
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 선택된 연도
  const [years, setYears] = useState<number[]>([]); // 활동이 있는 연도 목록
  const [totalContributions, setTotalContributions] = useState(0); // 총 활동 일수 계산

  const repositories = [
    { title: "성과 기반 인센티브 제도 설계", visibility: "Public", description: "각 부서의 성과 지표에 따라 평가 기준을 세분화하고, 피드백 루프를 도입하여 성과 평가의 투명성과 효율성을 높이는 방향으로 시스템을 최적화", dateRange: "2024.09.11 ~ 2024.10.30" },
    { title: "자동화된 리포트 생성 시스템 개발", visibility: "Public", description: "정기 리포트 생성을 자동화하여 시간 절약 및 정확도 향상", dateRange: "2024.08.01 ~ 2024.09.01" },
    { title: "고객 설문조사 결과 시각화", visibility: "Public", description: "고객 피드백을 바탕으로 설문 결과를 시각화하여 인사이트 도출", dateRange: "2024.05.10 ~ 2024.06.20" },
    { title: "전자상거래 사이트 구축", visibility: "Private", description: "소규모 비즈니스를 위한 전자상거래 웹사이트 개발", dateRange: "2023.11.10 ~ 2024.01.20" },
    { title: "교육 플랫폼 구축", visibility: "Public", description: "온라인 교육을 위한 플랫폼 설계 및 구축", dateRange: "2024.01.01 ~ 2024.03.30" },
    { title: "AI 기반 채팅봇 개발", visibility: "Private", description: "고객 서비스 업무를 지원하기 위해 자연어 처리(NLP) 기술을 활용한 채팅봇 개발", dateRange: "2024.02.01 ~ 2024.03.15" },
    { title: "사용자 데이터 암호화 보안 시스템 개선", visibility: "Public", description: "개인 정보 보호를 위해 데이터 암호화 수준을 향상시키고 보안 점검 프로세스 최적화", dateRange: "2023.08.10 ~ 2023.09.05" },
    { title: "사용자 인터페이스 개선 프로젝트", visibility: "Private", description: "고객 만족도를 높이기 위해 기존 인터페이스의 접근성과 사용성을 개선", dateRange: "2023.07.01 ~ 2023.08.15" },
    { title: "고객 맞춤형 추천 시스템 개발", visibility: "Public", description: "고객의 행동 데이터를 분석하여 맞춤형 상품 추천 알고리즘 개발", dateRange: "2023.10.05 ~ 2023.12.12" },
    { title: "리드 생성 최적화 마케팅 캠페인", visibility: "Private", description: "타겟팅 전략을 기반으로 한 마케팅 캠페인 최적화로 리드 생성 증가", dateRange: "2023.05.20 ~ 2023.06.30" },
    { title: "마케팅 분석 보고서 자동화", visibility: "Public", description: "마케팅 데이터 분석을 자동화하여 정기 보고서 생성", dateRange: "2023.03.05 ~ 2023.04.20" },
    { title: "클라우드 비용 최적화 프로젝트", visibility: "Private", description: "클라우드 서비스 사용 비용 절감을 위한 리소스 최적화 및 모니터링 시스템 구축", dateRange: "2023.02.10 ~ 2023.04.10" },
    { title: "효율적인 업무 자동화 시스템 구축", visibility: "Private", description: "반복적인 업무의 자동화를 통해 업무 효율성을 높이고, 리소스를 절약하는 시스템 구축", dateRange: "2023.04.01 ~ 2023.06.15" },
    { title: "머신러닝을 활용한 고객 이탈 예측 모델", visibility: "Public", description: "머신러닝 모델을 통해 고객 이탈을 예측하고 대응 전략 마련", dateRange: "2022.12.01 ~ 2023.01.15" },
    { title: "클라우드 기반 파일 관리 시스템", visibility: "Public", description: "기업 파일을 안전하게 관리하고 공유할 수 있는 클라우드 기반 솔루션 구축", dateRange: "2022.11.01 ~ 2023.01.25" },
    { title: "실시간 분석을 위한 데이터 파이프라인 구축", visibility: "Public", description: "데이터 수집 및 분석을 실시간으로 처리할 수 있는 파이프라인 구축", dateRange: "2022.09.01 ~ 2022.10.15" },
    { title: "데이터 분석을 통한 시장 트렌드 예측", visibility: "Public", description: "빅데이터 분석 기법을 활용하여 시장 트렌드를 예측하고, 사업 전략에 반영하는 시스템", dateRange: "2022.07.20 ~ 2022.08.30" },
    { title: "시스템 성능 모니터링 및 최적화", visibility: "Public", description: "시스템 성능을 모니터링하고, 자원을 최적화하여 성능 향상", dateRange: "2022.03.01 ~ 2022.04.20" },
];


  // 파스텔 색상 배열: 하이라이트 효과에 사용할 색상들
  const pastelColors = [
    "#FFD1DC", "#FFC3A0", "#FF9A8B", "#FFDEAD", "#C3FDB8", "#AEC6CF",
  ];

  // 날짜 범위 문자열을 시작일과 종료일로 파싱하는 함수
  const parseDateRange = (dateRange: string) => {
    const [start, end] = dateRange.split(" ~ "); // "~"로 구분하여 시작일과 종료일을 추출
    return {
      startDate: new Date(start), // 추출된 시작일을 Date 객체로 변환
      endDate: new Date(end), // 추출된 종료일을 Date 객체로 변환
    };
  };

  // 전체 레포지토리 목록의 총 활동 일수를 계산하는 함수
  const calculateTotalContributions = () => {
    let contributions = 0; // 총 기여도 초기화
    repositories.forEach((repo) => {
      const { startDate, endDate } = parseDateRange(repo.dateRange); // 각 레포지토리의 시작일과 종료일을 Date 객체로 변환
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
      const { startDate, endDate } = parseDateRange(repo.dateRange); // 각 레포지토리의 시작일과 종료일 가져오기
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
    const data = Array(weeksInYear).fill(null).map(() => Array(7).fill(0)); // 52주 X 7일 배열 초기화

    repositories.forEach((repo) => {
      const { startDate, endDate } = parseDateRange(repo.dateRange);
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) { // 시작일부터 종료일까지 반복
        const dayOfYear = Math.floor(
          (currentDate.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24)
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
  const handleMouseEnter = (dateRange: string) => {
    const { startDate, endDate } = parseDateRange(dateRange);
    const highlighted = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) { // 시작일부터 종료일까지 반복
      const dayOfYear = Math.floor(
        (currentDate.getTime() - new Date(selectedYear, 0, 1).getTime()) / (1000 * 60 * 60 * 24)
      ); // 선택된 연도의 첫날로부터 일수 계산
      const weekIndex = Math.floor(dayOfYear / 7); // 주 인덱스 계산
      const dayIndex = (currentDate.getDay() + 6) % 7; // 요일을 인덱스로 변환

      if (weekIndex < dummyData.length && dayIndex >= 0) {
        highlighted.push([weekIndex, dayIndex]); // 하이라이트 배열에 추가
      }
      currentDate.setDate(currentDate.getDate() + 1); // 날짜 하루씩 증가
    }

    setHighlightedDays(highlighted); // 하이라이트 날짜 저장
    setHighlightColor(pastelColors[Math.floor(Math.random() * pastelColors.length)]); // 랜덤 하이라이트 색상 선택
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
        <button className="create-button">생성</button>
      </header>

      {/* 레포지토리 목록 섹션 */}
      <ul className="repository-list">
        {paginatedRepos.map((repo, index) => (
          <li
            key={index}
            className="repository-item"
            onMouseEnter={() => handleMouseEnter(repo.dateRange)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="repository-content">
              <div className="title-row">
                <h2 className="repository-title">{repo.title}</h2>
                <span
                  className={`visibility-badge ${repo.visibility.toLowerCase()}`}
                >
                  {repo.visibility}
                </span>
              </div>
              <p className="repository-description">{repo.description}</p>
              <div className="repository-date">{repo.dateRange}</div>
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