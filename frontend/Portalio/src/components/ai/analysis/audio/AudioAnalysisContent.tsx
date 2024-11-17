import React from "react";
import { AudioInterviewResult } from "../../../../interface/aiInterview/AudioAnalysisInterface";

const AudioAnalysisContent: React.FC = () => {
  const interview: AudioInterviewResult = {
    interview_id: 17,
    interview_type: "audio",
    created_at: "2024-11-17T14:24:16.413358",
    questions: [
      {
        content:
          '질문: 개발PM에서 "스프린트"라는 용어의 의미와 역할에 대해 설명해 주실 수 있나요?',
        intent: "의도: 특정 용어에 대한 명확한 설명을 요구하고 있습니다.",
        tag: "직무",
        answers: [
          {
            content:
              "프린트 프린터는 일주일 다니고 하루 일당 있더라 언제든지 수 있습니다. 이렇게 하면 이렇게 하면 되는 거 아닌가요?",
            audio_url:
              "https://portalio.s3.amazonaws.com/audio_responses/166_1731813550.wav",
            feedback: {
              scores: {
                overall: 40,
                growth_potential: 50,
                job_understanding: 30,
                practical_ability: 20,
              },
              strengths: [
                {
                  point: "열정과 동기",
                  details:
                    "답변에서 스프린트에 대한 기본적인 이해를 보이려는 의도가 있었음.",
                  example: "프린트 프린터는 일주일 다니고 하루 일당 있더라",
                },
              ],
              improvements: [
                {
                  point: "직무 이해도 향상",
                  example:
                    "스프린트는 애자일 개발 방법론에서 일정 기간 동안 특정 목표를 달성하기 위해 팀이 집중하는 작업 단위를 의미합니다.",
                  priority: 1,
                  suggestion:
                    "스프린트의 정의와 역할에 대한 명확한 이해를 바탕으로 구체적인 설명을 준비해야 함.",
                },
              ],
              overall_feedback: {
                summary:
                  "답변이 스프린트의 개념과 역할에 대한 명확한 설명을 제공하지 못했으며, 직무 이해도가 낮은 것으로 평가됨.",
                next_steps: [
                  "애자일 개발 방법론과 스프린트에 대한 자료를 읽고 요약하기",
                  "과거 프로젝트에서의 경험을 정리하여 구체적인 사례로 준비하기",
                  "모의 면접을 통해 답변을 연습하고 피드백 받기",
                ],
                key_improvement:
                  "스프린트의 정의와 역할에 대한 명확한 이해를 바탕으로 구체적인 설명을 준비하는 것이 가장 중요함.",
              },
            },
            analysis: {
              transcript:
                "프린트 프린터는 일주일 다니고 하루 일당 있더라 언제든지 수 있습니다.",
              speech_metrics: {
                speech_rate: 85.23,
                volume_variation: 0.05,
                silence_ratio: 0.19,
                fluency_score: 0.81,
              },
              pronunciation_analysis: {
                expert_advice: [
                  "1. [발음 교정] '마지막은'과 '이동기'의 발음이 불명확하여 청중의 이해를 방해할 수 있습니다.",
                  "2. [패턴 분석] 말하기 속도는 보통이며, 긴 휴식이 다소 많아 자연스러운 흐름을 방해합니다.",
                  "3. [개선 제안] 발음 연습을 통해 각 단어를 분명하게 발음하고, 긴 휴식 대신 짧고 간결한 pauses를 활용하는 것이 좋습니다.",
                ],
                key_issues_count: 17,
                speaking_pattern: {
                  seperation_speed: "느림",
                  point: ["긴 휴식이 다소 많음"],
                },
              },
            },
          },
        ],
      },
    ],
  };

  // 점수 라벨링
  const scoreLabels: { [key: string]: string } = {
    overall: "전반적 평가",
    job_understanding: "직무 이해도",
    practical_ability: "실무 능력",
    growth_potential: "성장 가능성",
  };

  return (
    <>
      {interview.questions.map((question, qIndex) => (
        <section key={qIndex} className="mb-8">
          <header className="flex items-center mb-4 text-xl font-bold">
            <span className="mr-2">Q{qIndex + 1}.</span>
            {question.content}
          </header>

          {question.answers.map((answer, aIndex) => (
            <div
              key={aIndex}
              className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm border"
            >
              <div className="mb-4">
                <audio controls src={answer.audio_url} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
              <p className="mb-4 text-sm text-gray-800">
                <strong>답변 내용:</strong> {answer.content || "답변 없음"}
              </p>
              {/* 점수 */}
              <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">점수</h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(answer.feedback.scores).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col items-center">
                        <span className="text-sm capitalize">
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
                    )
                  )}
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
                    <strong className="text-md text-blue-700">
                      전문가 조언
                    </strong>
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
      ))}
    </>
  );
};

export default AudioAnalysisContent;
