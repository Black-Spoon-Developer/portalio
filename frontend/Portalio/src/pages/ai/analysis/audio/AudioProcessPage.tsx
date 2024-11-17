import React, { useState } from "react";

const AudioProcessPage: React.FC = () => {
  const currentIndex = 1;
  const currentQuestion = {
    question_text: "프론트엔드 개발자를 지망하는 이유가 무엇인가요?",
  };

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

  const [isRecording, setIsRecording] = useState();
  const handleAnswerSubmit = () => {};
  const startRecording = () => {};

  return (
    <div className="grid grid-cols-6">
      <section className="col-span-1"></section>
      {/* 메인 컨텐츠 */}
      <section className="col-span-4">
        {/* 질문 */}
        <header></header>
        <div>
          질문 {currentIndex + 1} {currentQuestion?.question_text}
        </div>
        {/* 녹음 버튼 - 시작 종료 2개를 만들어서 isRecording 상태에 따라서 다르게 보여주기 */}
        {isRecording ? (
          <button onClick={handleAnswerSubmit}>녹음 종료</button>
        ) : (
          <button onClick={startRecording}>녹음 시작</button>
        )}
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default AudioProcessPage;
