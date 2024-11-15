import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto h-30 py-2.5 bg-[#282c34] text-white  w-full">
      <section className="ml-5 my-3">
        <section className="flex items-center">
          <div className="my-2 text-3xl font-semibold">
            (주) 흑수저 개발자들
          </div>
          <div className="pl-2 font-semibold">| 개인정보처리방침</div>
          <div className="pl-2 font-semibold">| 이용약관</div>
        </section>
        <div className="my-3 text-sm">
          (39388) 경상북도 구미시 3공단3로 302 싸피 구미캠퍼스
        </div>
        <div className="my-2 text-sm">
          {"대표자: 김헌규 | 대표전화 : 1577-1234  | 사업자번호 : 112-12-11212"}
        </div>
      </section>
    </footer>
  );
};

export default Footer;
