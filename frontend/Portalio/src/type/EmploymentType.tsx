export interface EmploymentResponse {
  recrutPbancTtl: string; // 공고 정보
  instNm: string; // 회사 명
  srcUrl: string; // 회사 url
  workRgnNmLst: string; // 지역 명
  jobCategories: number[]; // 좝 카테고리
  hireTypeNmLst: string; // 정규직 그런거
  recrutSeNm: string; // 신입뽑는다함
  pbancBgngYmd: string; // 공고 시작
  pbancEndYmd: string; // 공고 끝
}