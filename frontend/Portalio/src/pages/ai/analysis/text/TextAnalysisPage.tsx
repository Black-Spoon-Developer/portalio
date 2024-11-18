import React, { useState } from "react";
import AiAnalysisTab from "../../../../components/ai/analysis/AiAnalysisTab";
import TextAnalysisContent from "../../../../components/ai/analysis/text/TextAnalysisContent";
import { Question } from "../../../../interface/aiInterview/AudioInterviewInterface";

const TextAnalysisPage: React.FC = () => {
  // useEffect로 질문 가져온 후 questions에 넣기
  // 질문 다루는 상태
  const questions: Question[] = [
    { id: 1, question: "개발할 때 가장 중요하게 생각하는 것은 무엇인가요?" },
    { id: 2, question: "실패 경험은?" },
    { id: 3, question: "가장 기억에 남는 프로젝트는 무엇인가요?" },
    { id: 4, question: "팀워크에서 중요한 점은 무엇인가요?" },
    { id: 5, question: "자신의 장점과 단점은 무엇인가요?" },
  ];

  // 탭 번호 상태
  const [selectedTab, setSelectedTab] = useState(1);

  // 탭 핸들러 함수
  const handleTabClick = (id: number) => {
    setSelectedTab(id);
  };

  // 몇번 질문을 골랐는지에 대한 변수
  const selectedQuestion = questions.find((q) => q.id === selectedTab);

  return (
    <div className="grid grid-cols-6 gap-4 p-4 my-4">
      <section className="col-span-1"></section>

      {/* 메인 내용 */}
      <section className="col-span-4 bg-white p-6 rounded-lg">
        <header className="flex justify-between">
          {/* 타이틀 */}
          <h2 className="text-5xl font-bold mb-7 pb-3 border-b-2">
            📈 면접 결과 분석
          </h2>
          {/* 질문 탭 */}
          <AiAnalysisTab
            questions={questions}
            selectedTab={selectedTab}
            onTabClick={handleTabClick}
          />
        </header>

        {/* 질문 출력 부분 */}
        <main>
          {selectedQuestion && (
            <TextAnalysisContent question={selectedQuestion} />
          )}
        </main>
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default TextAnalysisPage;
