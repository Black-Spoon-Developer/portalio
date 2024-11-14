// ProgressStepper.tsx
// 질문 진행 상태를 시각적으로 표현
import React from "react";
import { InterviewState } from "../../../type/InterviewType"

interface ProgressStepperProps {
  questions: InterviewState["questions"]; // InterviewState의 questions 속성 타입 가져오기
  currentQuestionIndex: InterviewState["currentQuestionIndex"]; // InterviewState의 currentQuestionIndex 속성 타입 가져오기
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ questions, currentQuestionIndex }) => {
  return (
    <header className="mb-6 text-center w-full max-w-2xl">
      <nav className="flex justify-evenly" aria-label="Progress">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center font-bold text-white rounded transform rotate-45 ${
              index <= currentQuestionIndex ? "bg-[#57D4E2]" : "bg-gray-300"
            } shadow-md`}
          >
            <span className="transform -rotate-45">{index + 1}</span>
          </div>
        ))}
      </nav>
    </header>
  );
};

export default ProgressStepper;
