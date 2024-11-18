// 텍스트 면접에서 답변을 입력하는 입력란
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface AnswerInputProps {
  textAnswer: string;
  setTextAnswer: (value: string) => void;
  handleTextAnswerSubmit: () => void;
}

const InterviewTextAnswerInput: React.FC<AnswerInputProps> = ({
  textAnswer,
  setTextAnswer,
  handleTextAnswerSubmit,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleTextAnswerSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mt-4">
      <label htmlFor="textAnswer" className="sr-only">
        답변 입력
      </label>
      <div className="relative">
        <input
          id="textAnswer"
          type="text"
          placeholder="답변을 입력하세요."
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border-2 border-gray-300 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#57D4E2] focus:border-transparent text-lg"
        />
        <button
          onClick={handleTextAnswerSubmit}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#57D4E2] hover:text-[#45b2c3] text-2xl transition-colors"
          aria-label="답변 제출"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
};

export default InterviewTextAnswerInput;
