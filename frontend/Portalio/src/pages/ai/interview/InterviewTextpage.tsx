// ChatInterviewPage.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { interviewActions } from "../../../store/interview/InterviewSlice";
import { useNavigate } from "react-router-dom";
import ProgressStepper from "../../../components/ai/interview/InterviewProgressStep";
import ChatLog from "../../../components/ai/interview/InterviewTextChatLog";
import AnswerInput from "../../../components/ai/interview/InterviewTextAnswerInput";

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

    setChatLog((prevLog) => [
      ...prevLog,
      { type: "answer", content: textAnswer },
    ]);
    setTextAnswer("");

    if (currentQuestionIndex >= questions.length - 1) {
      navigate("/ai/analyze/1/");
    } else {
      dispatch(interviewActions.incrementQuestionIndex());
      setChatLog((prevLog) => [
        ...prevLog,
        { type: "question", content: questions[currentQuestionIndex + 1], index: currentQuestionIndex + 2 },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <ProgressStepper questions={questions} currentQuestionIndex={currentQuestionIndex} />
      <ChatLog chatLog={chatLog} />
      <AnswerInput textAnswer={textAnswer} setTextAnswer={setTextAnswer} handleTextAnswerSubmit={handleTextAnswerSubmit} />
    </div>
  );
}
