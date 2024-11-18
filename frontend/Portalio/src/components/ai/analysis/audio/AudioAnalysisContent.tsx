import React from "react";
import { AudioInterviewResult } from "../../../../interface/aiInterview/AudioInterviewInterface";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../spinner/LoadingSpinner";

interface AudioAnalysisContentProps {
  result?: AudioInterviewResult;
  selectedTab: number;
}

const AudioAnalysisContent: React.FC<AudioAnalysisContentProps> = ({
  result,
  selectedTab,
}) => {
  // 점수를 애니메이션으로 증가시키기 위한 상태
  const [animatedScores, setAnimatedScores] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const targetScores = selectedQuestion.answers[0]?.feedback.scores || {};

    // 애니메이션 시작: setTimeout을 이용해 점수를 한 번에 설정
    setTimeout(() => {
      setAnimatedScores(targetScores);
    }, 100); // 0.1초 딜레이 후 애니메이션 시작
  }, [selectedTab]);

  if (!result) {
    return <LoadingSpinner mode="Analysis" />;
  }

  const selectedQuestion = result.questions[selectedTab];

  // 점수 라벨링
  const scoreLabels: { [key: string]: string } = {
    overall: "전반적 평가",
    job_understanding: "직무 이해도",
    practical_ability: "실무 능력",
    growth_potential: "성장 가능성",
    problem_solving: "문제 해결력",
    result_achievement: "성과 달성도",
    situation_analysis: "상황 분석력",
    communication: "의사소통능력",
    teamwork: "팀워크",
    value_alignment: "가치관 부합도",
    attitude: "태도",
  };

  return (
    <>
      <section className="mb-8">
        <header className="flex items-center mb-4 text-xl font-bold">
          <div>{selectedQuestion.content}</div>
        </header>

        {selectedQuestion.answers.map((answer, aIndex) => (
          <div
            key={aIndex}
            className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border"
          >
            <p className="mb-4 text-sm text-gray-800">
              <strong>답변 내용:</strong> {answer.content || "답변 없음"}
            </p>
            {/* 점수 */}
            <section className="mb-4">
              <h3 className="text-lg font-semibold mb-2">점수</h3>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(answer.feedback.scores).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center">
                    <span className="text-sm capitalize">
                      {scoreLabels[key] || key}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                      <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{
                          width: `${animatedScores[key] || 0}%`,
                          transition: "width 1s ease-in-out", // 애니메이션 적용
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold mt-2">{value}%</span>
                  </div>
                ))}
              </div>
            </section>
            {/* 강점 */}
            <section className="mb-4">
              <h3 className="text-lg font-semibold mb-2">강점</h3>
              {answer.feedback.strengths.map((strength, sIndex) => (
                <div
                  key={sIndex}
                  className="p-3 bg-green-100 rounded-lg mb-2 border border-green-300"
                >
                  <h4 className="font-medium text-green-700">
                    {strength.point}
                  </h4>
                  <p className="text-sm mt-1">{strength.details}</p>
                  <p className="text-xs italic mt-1 text-gray-600">
                    예: {strength.example}
                  </p>
                </div>
              ))}
            </section>
            {/* 개선점 */}
            <section className="mb-4">
              <h3 className="text-lg font-semibold mb-2">개선점</h3>
              {answer.feedback.improvements.map((improvement, iIndex) => (
                <div
                  key={iIndex}
                  className="p-3 bg-yellow-100 rounded-lg mb-2 border border-yellow-300"
                >
                  <h4 className="font-medium text-yellow-700">
                    {improvement.point} (우선순위: {improvement.priority})
                  </h4>
                  <p className="text-sm mt-1">{improvement.suggestion}</p>
                  <p className="text-xs italic mt-1 text-gray-600">
                    예: {improvement.example}
                  </p>
                </div>
              ))}
            </section>
            {/* 발음 분석 */}
            <section className="mb-4">
              <h3 className="text-lg font-semibold mb-2">발음 분석</h3>
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg">
                <p className="mb-4">
                  <strong className="text-md text-blue-700">전문가 조언</strong>
                  <div className="text-sm">
                    {answer.analysis.pronunciation_analysis.expert_advice.map(
                      (advice, aIndex) => (
                        <div key={aIndex}>{advice}</div>
                      )
                    )}
                  </div>
                </p>
                <p>
                  <strong className="text-blue-700">문제 수:</strong>{" "}
                  {answer.analysis.pronunciation_analysis.key_issues_count}
                </p>
                <div className="mt-2">
                  <h4 className="font-bold text-lg my-3 text-blue-700">
                    말하기 패턴
                  </h4>
                  <p className="text-sm mb-2">
                    <strong className="">속도:</strong>{" "}
                    {answer.analysis.pronunciation_analysis.speaking_pattern
                      .seperation_speed || "정보 없음"}
                  </p>
                  <div className="list-disc list-inside mt-1 text-sm">
                    <div className="font-bold">특징</div>
                    {answer.analysis.pronunciation_analysis.speaking_pattern.point?.map(
                      (pattern, index) => (
                        <li key={index} className="ml-3">
                          {pattern}
                        </li>
                      )
                    ) || <li>정보 없음.</li>}
                  </div>
                </div>
              </div>
            </section>
            {/* 전반적 피드백 */}
            <section>
              <h3 className="text-lg font-semibold mb-2">전반적 피드백</h3>
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg shadow">
                <p className="text-sm">
                  <strong>요약:</strong>{" "}
                  {answer.feedback.overall_feedback.summary}
                </p>
                <p className="text-sm mt-2">
                  <strong>핵심 개선 사항:</strong>{" "}
                  {answer.feedback.overall_feedback.key_improvement}
                </p>
                <h4 className="text-md font-semibold mt-4">다음 단계</h4>
                <ul className="list-disc list-inside text-sm mt-2">
                  {answer.feedback.overall_feedback.next_steps.map(
                    (step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    )
                  )}
                </ul>
              </div>
            </section>
          </div>
        ))}
      </section>
    </>
  );
};

export default AudioAnalysisContent;
