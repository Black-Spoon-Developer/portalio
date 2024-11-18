import React, { useEffect, useState } from "react";
import AiAnalysisTab from "../../../../components/ai/analysis/AiAnalysisTab";
import TextAnalysisContent from "../../../../components/ai/analysis/text/TextAnalysisContent";
import { useDispatch } from "react-redux";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";
import { getAiInterviewAnalysis } from "../../../../api/AiInterviewCommonAPI";
import { useParams } from "react-router-dom";
import { TextInterviewResult } from "../../../../interface/aiInterview/TextInterviewInterface";
import { InterviewActions } from "../../../../store/aiInterview/InterviewSlice";

const TextAnalysisPage: React.FC = () => {
  const dispatch = useDispatch();

  // 인터뷰 ID
  const { interview_id } = useParams<{ interview_id: string }>();
  const interviewID = Number(interview_id);

  // 결과를 담을 상태
  const [analysisResult, setAnalysisResult] = useState<TextInterviewResult>();

  // 탭 번호 상태
  const [selectedTab, setSelectedTab] = useState(0);

  // 탭 핸들러 함수
  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    const getAnalysisResult = async () => {
      try {
        const result = await getAiInterviewAnalysis(interviewID);
        setAnalysisResult(result);
        dispatch(InterviewActions.resetState());
      } catch (error) {
        console.error("Error fetching analysis result:", error);
      }
    };
    getAnalysisResult();
  }, []);

  if (!analysisResult) {
    return <LoadingSpinner mode="Analysis" />;
  }

  return (
    <div className="grid grid-cols-6 gap-4 p-4 my-4 min-h-screen">
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
            questions={analysisResult?.questions}
            selectedTab={selectedTab}
            onTabClick={handleTabClick}
          />
        </header>

        {/* 질문 출력 부분 */}
        <main>
          <TextAnalysisContent
            result={analysisResult}
            selectedTab={selectedTab}
          />
        </main>
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default TextAnalysisPage;
