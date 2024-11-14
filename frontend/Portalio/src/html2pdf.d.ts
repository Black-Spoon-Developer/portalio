// pdf 변환 라이브러리가 설치 명령어로 typescript로 적용이 안되기 때문에 이렇게 설정을 했습니다. 건들지 마시오
declare module "html2pdf.js" {
  const html2pdf: any;
  export default html2pdf;
}
