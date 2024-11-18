import React, { useState } from "react";
import AudioAnalysisContent from "../../../../components/ai/analysis/audio/AudioAnalysisContent";
import { getAiInterviewAnalysis } from "../../../../api/AiInterviewCommonAPI";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AudioInterviewResult } from "../../../../interface/aiInterview/AudioInterviewInterface";
import AiAnalysisTab from "../../../../components/ai/analysis/AiAnalysisTab";
import { useDispatch } from "react-redux";
import { InterviewActions } from "../../../../store/aiInterview/InterviewSlice";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";

const AudioAnalysisPage: React.FC = () => {
  const dispatch = useDispatch();
  // 결과를 담을 상태
  const [analysisResult, setAnalysisResult] = useState<AudioInterviewResult>();

  // 인터뷰 ID 가져오기
  const { interview_id } = useParams<{ interview_id: string }>();
  // 인터뷰 ID숫자형으로 변환
  const interviewID = Number(interview_id);

  // onMounted 됐을때 인터뷰 결과 가져오기
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

  // 탭 번호 상태
  const [selectedTab, setSelectedTab] = useState(0);

  // 탭 핸들러 함수
  const handleTabClick = (index: number) => {
    setSelectedTab(index);
  };

  if (!analysisResult) {
    return <LoadingSpinner mode="Analysis" />;
  }

  return (
    <div className="grid grid-cols-6 gap-4 p-4 my-4 min-h-screen">
      <section className="col-span-1"></section>
      <section className="col-span-4 my-10">
        <header className="flex justify-between">
          {/* 타이틀 */}
          <h2 className="text-5xl font-bold mb-7 pb-3 border-b-2">
            📈 면접 결과 분석
          </h2>
          <AiAnalysisTab
            questions={analysisResult?.questions}
            selectedTab={selectedTab}
            onTabClick={handleTabClick}
          />
        </header>
        <main>
          <AudioAnalysisContent
            result={analysisResult}
            selectedTab={selectedTab}
          />
        </main>
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default AudioAnalysisPage;
