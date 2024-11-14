// QuestionDisplay.tsx
// 현재 질문을 표시
import React from "react";

interface QuestionDisplayProps {
  question: string;
  questionNumber: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, questionNumber }) => (
  <section className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{`질문 ${questionNumber}`}</h2>
    <p className="text-2xl font-bold text-gray-800">{question}</p>
  </section>
);

export default QuestionDisplay;
