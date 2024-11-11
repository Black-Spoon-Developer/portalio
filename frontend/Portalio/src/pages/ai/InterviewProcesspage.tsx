// src/pages/interview/InterviewProcessPage.tsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import InterviewProcess from "../../components/ai/InterviewProcess";

const InterviewProcessPage: React.FC = () => {
  const { interview_id } = useParams<{ interview_id: string }>();
  const location = useLocation();
  const interviewType = location.state?.type || "video"; // 기본값을 "text"로 설정
  const interviewId = parseInt(interview_id || "0", 10);

  return (
    <div>
      <h1>{interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}</h1>
      <InterviewProcess interviewType={interviewType} interviewId={interviewId} />
    </div>
  );
};

export default InterviewProcessPage;
