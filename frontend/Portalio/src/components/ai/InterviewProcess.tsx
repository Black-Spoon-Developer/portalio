// src/components/interview/InterviewProcess.tsx
import React from "react";
import WebcamCapture from "../ai/WebcamCapture";
import QuestionTimer from "../ai/QuestionTimer";

interface InterviewProcessProps {
  interviewType: "video" | "audio" | "text";
  interviewId: number;
  currentQuestion: string;
  isAnswering: boolean;
  // isRecording: boolean; // 녹화 상태 전달이 필요하면 주석 해제
}

const InterviewProcess: React.FC<InterviewProcessProps> = ({
  interviewType,
  interviewId,
  currentQuestion,
  isAnswering,
  // isRecording,
}) => {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
      {interviewType === "video" ? (
        <WebcamCapture interviewId={interviewId} /* isRecording={isRecording} */ />
      ) : (
        <img
          src="/path/to/default_img.png"
          alt="음성 면접 이미지"
          className="w-full h-full object-cover rounded-lg"
        />
      )}

    </div>
  );
};

export default InterviewProcess;
