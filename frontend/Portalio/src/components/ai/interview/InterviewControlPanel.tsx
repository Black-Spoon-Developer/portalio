// InterviewControlPanel.tsx
// 인터뷰 타입에 따라서 인터뷰 화면이랑 타이머를 포함하는 패널
import React from "react";
import WebcamCapture from "../record/WebcamCapture";
import QuestionTimer from "../question/QuestionTimer";
import { InterviewType } from "../../../type/InterviewType";

interface InterviewControlPanelProps {
  interviewType: InterviewType;
  isRecording: boolean;
  isPreparationTime: boolean;
  onRecordingComplete: (blob: Blob) => void;
  onPreparationEnd: () => void;
  onAnswerEnd: () => void;
}

const InterviewControlPanel: React.FC<InterviewControlPanelProps> = ({
  interviewType,
  isRecording,
  isPreparationTime,
  onRecordingComplete,
  onPreparationEnd,
  onAnswerEnd,
}) => (
  <div className="w-1/2 max-w-lg bg-white rounded-lg shadow-md p-4 relative">
    <div className="flex justify-between items-center mb-4">
      <span className="bg-gray-200 text-gray-800 font-bold text-center rounded-lg px-4 py-2">
        {interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}
      </span>
      <QuestionTimer
        isPreparationTime={isPreparationTime}
        preparationTime={30}
        answerTime={60}
        onPreparationEnd={onPreparationEnd}
        onAnswerEnd={onAnswerEnd}
      />
    </div>

    <div className="bg-gray-200 w-full mb-4 rounded-lg flex items-center justify-center overflow-hidden">
      {interviewType === "video" && (
        <WebcamCapture isRecording={isRecording} onRecordingComplete={onRecordingComplete} />
      )}
      {interviewType === "audio" && <img src="/path/to/default-image.png" alt="음성 면접 이미지" />}
    </div>
  </div>
);

export default InterviewControlPanel;
