// src/pages/interview/InterviewIntroPage.tsx
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IntroImage1 from "../../assets/Interview/IntroImage1.webp";
import IntroImage2 from "../../assets/Interview/IntroImage2.webp";
import IntroImage3 from "../../assets/Interview/IntroImage3.webp";
import IntroImage4 from "../../assets/Interview/IntroImage4.webp";

const InterviewIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<HTMLDivElement[]>([]);

  const handleStartButtonClick = () => {
    navigate("/ai/question");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // `data-faded` 속성이 없는 요소에만 fade-in 적용
          if (
            entry.isIntersecting &&
            !entry.target.getAttribute("data-faded")
          ) {
            let opacity = 0;
            let translateY = 20;

            // 서서히 나타나게 스타일을 직접 조정
            const interval = setInterval(() => {
              if (opacity < 1) {
                opacity += 0.02;
                translateY -= 1;
                entry.target.setAttribute(
                  "style",
                  `opacity: ${opacity}; transform: translateY(${translateY}px);`
                );
              } else {
                clearInterval(interval);
                // 애니메이션이 끝난 후 `data-faded` 속성을 추가해 재진입 시 fade-in 방지
                entry.target.setAttribute("data-faded", "true");
              }
            }, 30);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="w-full h-full bg-white relative">
      {/* 고정된 시작 버튼 */}
      <button
        onClick={handleStartButtonClick}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-teal-600 transition z-50"
      >
        시작하기
      </button>

      {/* 각 섹션의 콘텐츠 */}
      <div
        ref={(el) => el && sectionRefs.current.push(el)}
        style={{
          opacity: 0,
          transform: "translateY(20px)",
        }}
        className="py-8"
      >
        <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${IntroImage1})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <h2 className="text-4xl font-bold mb-4">
              혹시 면접이 두려우신가요?
            </h2>
            <p className="text-xl">AI 모의 면접을 통해 자신감을 키우세요!</p>
          </div>
        </div>
      </div>

      <div
        ref={(el) => el && sectionRefs.current.push(el)}
        style={{
          opacity: 0,
          transform: "translateY(20px)",
        }}
        className="py-8"
      >
        <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${IntroImage2})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <h2 className="text-4xl font-bold mb-4">포트폴리오 기반의 질문</h2>
            <p className="text-xl">직무에 관련된 질문과 피드백을 제공합니다.</p>
          </div>
        </div>
      </div>

      <div
        ref={(el) => el && sectionRefs.current.push(el)}
        style={{
          opacity: 0,
          transform: "translateY(20px)",
        }}
        className="py-8"
      >
        <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${IntroImage3})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <h2 className="text-4xl font-bold mb-4">면접 유형 선택</h2>
            <p className="text-xl">
              화상, 음성, 텍스트 면접 중 선택 가능합니다.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={(el) => el && sectionRefs.current.push(el)}
        style={{
          opacity: 0,
          transform: "translateY(20px)",
        }}
        className="py-8"
      >
        <div
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${IntroImage4})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <h2 className="text-4xl font-bold mb-4">AI 모의 면접 설명</h2>
            <p className="text-xl">
              AI로 분석된 피드백을 통해 면접 준비를 완벽하게 하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewIntroPage;
