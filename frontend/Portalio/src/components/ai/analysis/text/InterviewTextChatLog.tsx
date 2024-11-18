// ChatLog.tsx
// 텍스트 면접에서 질문과 답변이 표시되는 영역
import React from "react";

interface ChatLogEntry {
  type: "question" | "answer";
  content: string;
  index?: number;
}

interface ChatLogProps {
  chatLog: ChatLogEntry[];
}

const InterviewTextChatLog: React.FC<ChatLogProps> = ({ chatLog }) => {
  return (
    <main
      className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 flex flex-col overflow-y-auto"
      style={{ height: "500px" }}
    >
      {chatLog.map((entry, index) => (
        <div
          key={index}
          className={`flex ${
            entry.type === "question" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`${
              entry.type === "question"
                ? "bg-[#57D4E2] text-white"
                : "bg-gray-200 text-gray-900"
            } rounded-lg px-4 py-2 max-w-xs shadow-md`}
          >
            {entry.type === "question" && entry.index !== undefined
              ? `질문 ${entry.index}: `
              : ""}
            {entry.content}
          </div>
        </div>
      ))}
    </main>
  );
};

export default InterviewTextChatLog;
