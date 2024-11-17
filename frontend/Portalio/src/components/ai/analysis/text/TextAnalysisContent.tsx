import React from "react";

interface Question {
  id: number;
  question: string;
}

interface Feedback {
  scores: {
    overall: number;
    job_understanding: number;
    practical_ability: number;
    growth_potential: number;
  };
  strengths: { point: string; details: string; example: string }[];
  improvements: {
    point: string;
    priority: number;
    suggestion: string;
    example: string;
  }[];
  overall_feedback: {
    summary: string;
    key_improvement: string;
    next_steps: string[];
  };
}

const TextAnalysisContent: React.FC<{ question: Question }> = ({
  question,
}) => {
  // 몇 번 질문인지에 따라서 나타내는 번호 이모지
  const getEmojiById = (id: number): string => {
    switch (id) {
      case 1:
        return "1️⃣";
      case 2:
        return "2️⃣";
      case 3:
        return "3️⃣";
      case 4:
        return "4️⃣";
      case 5:
        return "5️⃣";
      default:
        return "❓"; // 기본값 (알 수 없는 번호)
    }
  };

  // 번호 이모지 함수
  const emoji = getEmojiById(question.id);

  // 면접 결과 피드백 내용
  const feedback: Feedback = {
    scores: {
      overall: 75,
      job_understanding: 70,
      practical_ability: 80,
      growth_potential: 75,
    },
    strengths: [
      {
        point: "문제 해결 능력",
        details:
          "구체적인 문제를 인식하고, 다양한 해결 방법을 모색하여 최적의 솔루션을 도출하는 능력이 뛰어납니다.",
        example: "API 호출 최적화를 위한 타일링 기법을 적용한 사례.",
      },
    ],
    improvements: [
      {
        point: "직무 이해도 강화",
        priority: 1,
        suggestion:
          "프론트엔드 개발자의 역할과 책임을 더 명확히 이해하고, 최신 기술 트렌드에 대한 지식을 업데이트하는 것이 필요합니다.",
        example:
          "프론트엔드 개발에서 사용하는 다양한 프레임워크(React, Vue 등)와 그 특징을 비교하여 설명할 수 있도록 준비하세요.",
      },
      {
        point: "답변 구조 개선",
        priority: 2,
        suggestion:
          "답변을 더 체계적으로 구성하여 각 역할과 기술을 명확히 구분하고, 예시를 통해 설명하는 것이 좋습니다.",
        example:
          "UI/UX 디자인 구현, 웹 표준 및 접근성 준수 등 각 항목에 대해 구체적인 사례를 제시하여 설명하세요.",
      },
    ],
    overall_feedback: {
      summary:
        "전반적으로 프론트엔드 개발자의 역할에 대한 기본적인 이해는 있으나, 좀 더 구체적인 기술적 지식과 경험이 필요합니다.",
      key_improvement: "직무 이해도를 높이기 위한 노력",
      next_steps: [
        "업계 관련 자료 및 최신 기술 동향을 정기적으로 학습하고, 관련 프로젝트에 참여하여 실무 경험을 쌓으세요.",
        "면접 준비 시, 각 기술의 실제 사용 사례를 연구하여 답변에 포함시키세요.",
      ],
    },
  };

  // 점수 라벨링
  const scoreLabels: { [key: string]: string } = {
    overall: "전반적 평가",
    job_understanding: "직무 이해도",
    practical_ability: "실무 능력",
    growth_potential: "성장 가능성",
  };

  return (
    <div>
      <header className="flex items-center mb-5 text-2xl">
        <div className="mr-2">{emoji}</div>
        <div className="font-bold">{question.question}</div>
      </header>

      {/* 내용 부분 */}
      {/* 점수 섹션 */}
      <section>
        <h2 className="text-xl font-bold mb-4">점수</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(feedback.scores).map(([key, value]) => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-sm font-medium capitalize">
                {scoreLabels[key] || key}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${value}%` }}
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
    </div>
  );
};

export default TextAnalysisContent;
