import React from "react";
import CameraPreview from "../../components/ai/Preview/CameraPreview";
import MicTest from "../../components/ai/Preview/MicPreview";
import InterviewOptions from "../../components/ai/InterviewOptions";
import { useNavigate } from "react-router-dom";

const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartInterview = (type: "video" | "audio" | "text") => {
    navigate("/ai/interview/process", { state: { type } });
  };

  return (
    <div>
      <h1>면접 준비 페이지</h1>
      <CameraPreview />
      <MicTest />
      <InterviewOptions onOptionSelect={handleStartInterview} />
    </div>
  );
};

export default InterviewSetupPage;
