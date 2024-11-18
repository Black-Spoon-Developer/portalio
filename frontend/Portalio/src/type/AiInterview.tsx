export interface InterviewReportResponse {
  interview_log_id: number; // 분석 기록 조회 용도
  interview_id: number; // 상세 페이지 이동용 id
  user_nickname: string; // 유저 닉네임
  member_picture: string; // 유저 프사 
  interview_count: number; // 인터뷰 분석 횟수
  ticket_count: number; // 티켓 숫자
  created_at: string; // 작성일
  portfolio_title: string; // 포트폴리오 제목
  repository_title: string; // 레포지토리 제목
  select_job: string; // 희망 직무
  interview_type: string; // 인터뷰 형식
  interview_grade: string; // 평가 등급
}

export interface FastRequest {
  skip: number;
  limit: number;
}