import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { interviewActions } from "../../store/interview/InterviewSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatInterviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { questions, currentQuestionIndex } = useSelector((state: RootState) => state.interview);

  const [textAnswer, setTextAnswer] = useState("");
  const [chatLog, setChatLog] = useState<{ type: "question" | "answer"; content: string; index?: number }[]>([
    { type: "question", content: questions[0], index: 1 },
  ]);

  const handleTextAnswerSubmit = () => {
    if (!textAnswer.trim()) return;

    // 사용자가 입력한 답변을 chatLog에 추가
    setChatLog((prevLog) => [
      ...prevLog,
      { type: "answer", content: textAnswer },
    ]);

    // 답변 제출 후 입력란 초기화
    setTextAnswer("");

    // 다음 질문으로 넘어가거나 끝났을 때 페이지 이동
    if (currentQuestionIndex >= questions.length - 1) {
      navigate("/ai/analyze/1/");
    } else {
      // 다음 질문을 chatLog에 추가하고 질문 인덱스 증가
      dispatch(interviewActions.incrementQuestionIndex());
      setChatLog((prevLog) => [
        ...prevLog,
        { type: "question", content: questions[currentQuestionIndex + 1], index: currentQuestionIndex + 2 },
      ]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleTextAnswerSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Step 표시 */}
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

      {/* 대화형 질문/답변 영역 */}
      <main className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 flex flex-col overflow-y-auto" style={{ height: '500px' }}>
        {chatLog.map((entry, index) => (
          <div
            key={index}
            className={`flex ${entry.type === "question" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`${
                entry.type === "question" ? "bg-[#57D4E2] text-white" : "bg-gray-200 text-gray-900"
              } rounded-lg px-4 py-2 max-w-xs shadow-md`}
            >
              {entry.type === "question" && entry.index !== undefined ? `질문 ${entry.index}: ` : ""}
              {entry.content}
            </div>
          </div>
        ))}
      </main>

      {/* 답변 입력란 */}
      <div className="w-full max-w-2xl mt-4">
        <label htmlFor="textAnswer" className="sr-only">답변 입력</label>
        <div className="relative">
          <input
            id="textAnswer"
            type="text"
            placeholder="답변을 입력하세요."
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            onKeyDown={handleKeyDown} // 엔터 키 감지 추가
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
    </div>
  );
}
