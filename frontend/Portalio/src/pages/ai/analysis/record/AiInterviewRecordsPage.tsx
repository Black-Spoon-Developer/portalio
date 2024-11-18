import React from "react";
import AiInterviewContentList from "../../../../components/ai/analysis/record/AiInterviewContentList";

const AiInterviewRecordsPage: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 my-4 min-h-screen">
      <div className="col-span-1"></div>
      <div className="col-span-2">
        <header className="flex justify-between">
          {/* 타이틀 */}
          <h2 className="text-5xl font-bold mb-7 pb-3 border-b-2">
            📋 AI 모의 면접 분석 기록
          </h2>
        </header>

        <section>
          <AiInterviewContentList />
        </section>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default AiInterviewRecordsPage;
