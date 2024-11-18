import React, { useState, useEffect } from "react";
import { TextInterviewResult } from "../../../../interface/aiInterview/TextInterviewInterface";

interface TextAnalysisContentProps {
  result: TextInterviewResult;
  selectedTab: number;
}

const TextAnalysisContent: React.FC<TextAnalysisContentProps> = ({
  result,
  selectedTab,
}) => {
  // 점수를 애니메이션으로 증가시키기 위한 상태
  const [animatedScores, setAnimatedScores] = useState<{
    [key: string]: number;
  }>({});

  const selectedQuestion = result.questions[selectedTab];
  const feedback = selectedQuestion.answers[0]?.feedback;

  useEffect(() => {
    if (!feedback) return;

    const targetScores = feedback.scores || {};
    const initialScores = Object.keys(targetScores).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as { [key: string]: number });

    setAnimatedScores(initialScores);

    const interval = setInterval(() => {
      setAnimatedScores((prevScores) => {
        const updatedScores = { ...prevScores };
        let done = true;

        for (const key in targetScores) {
          if (updatedScores[key] < targetScores[key]) {
            updatedScores[key] = Math.min(
              updatedScores[key] + 5,
              targetScores[key]
            );
            done = false;
          }
        }

        if (done) clearInterval(interval);
        return updatedScores;
      });
    }, 50); // 50ms 간격으로 점수 업데이트

    return () => clearInterval(interval);
  }, [feedback]);

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
    <section>
      <header className="flex items-center mb-5 text-2xl">
        <div>{selectedQuestion.content}</div>
      </header>

      {/* 점수 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">점수</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(animatedScores).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-sm font-medium capitalize">
                {scoreLabels[key] || key}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{
                    width: `${animatedScores[key] || 0}%`,
                    transition: "width 0.5s ease-in-out", // AudioAnalysisContent 애니메이션 스타일 적용
                  }}
                ></div>
              </div>
              <span className="text-sm font-bold mt-2">{value}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* 강점 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">강점</h2>
        {feedback.strengths.map((strength, index) => (
          <div
            key={index}
            className="p-4 bg-green-100 rounded-lg mb-4 shadow-sm border border-green-300"
          >
            <h3 className="text-lg font-semibold text-green-700">
              {strength.point}
            </h3>
            <p className="text-sm mt-2">{strength.details}</p>
            <p className="text-sm italic text-gray-600 mt-1">
              예: {strength.example}
            </p>
          </div>
        ))}
      </section>

      {/* 개선점 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">개선점</h2>
        {feedback.improvements.map((improvement, index) => (
          <div
            key={index}
            className="p-4 bg-yellow-100 rounded-lg mb-4 shadow-sm border border-yellow-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-yellow-700">
                {improvement.point}
              </h3>
              <span className="text-sm text-gray-500">
                우선순위: {improvement.priority}
              </span>
            </div>
            <p className="text-sm mt-2">{improvement.suggestion}</p>
            <p className="text-sm italic text-gray-600 mt-1">
              예: {improvement.example}
            </p>
          </div>
        ))}
      </section>

      {/* 전반적 피드백 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">전반적 피드백</h2>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <p className="text-sm mb-2 font-medium">
            {feedback.overall_feedback.summary}
          </p>
          <h3 className="text-md font-semibold mt-4">핵심 개선 사항</h3>
          <p className="text-sm mt-2">
            {feedback.overall_feedback.key_improvement}
          </p>
          <h3 className="text-md font-semibold mt-4">다음 단계</h3>
          <ul className="list-disc list-inside text-sm mt-2">
            {feedback.overall_feedback.next_steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
};

export default TextAnalysisContent;
