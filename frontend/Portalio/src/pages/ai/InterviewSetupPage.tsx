import React, { useState, useEffect } from "react";
import CameraPreview from "../../components/ai/Preview/CameraPreview";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/ai/button/InterviewProcessBtn";

const InterviewSetupPage: React.FC = () => {
  const [cameraStatus, setCameraStatus] = useState<"양호" | "불량">("불량");
  const [micStatus, setMicStatus] = useState<"양호" | "불량">("불량");
  const navigate = useNavigate();

  // 카메라와 마이크 상태 확인
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setCameraStatus("양호"))
      .catch(() => setCameraStatus("불량"));

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicStatus("양호"))
      .catch(() => setMicStatus("불량"));
  }, []);

  const startInterview = (type: "video" | "audio" | "text") => {
    navigate("/ai/interview/process", { state: { type } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">AI 모의 면접을 준비해주세요</h1>

        <div className="flex justify-center items-center space-x-4 text-lg mb-6">
          <div className="flex items-center space-x-2">
            <i className="fas fa-video text-gray-700"></i>
            <span className={cameraStatus === "양호" ? "text-blue-500" : "text-red-500"}>
              카메라 {cameraStatus}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-microphone text-gray-700"></i>
            <span className={micStatus === "양호" ? "text-blue-500" : "text-red-500"}>
              마이크 {micStatus}
            </span>
          </div>
        </div>

        <div className="relative mb-8">
          <CameraPreview cameraStatus={cameraStatus} />
        </div>

        <div className="text-sm text-gray-500 mb-6">
          질문 생성이 완료되면 시작 버튼이 활성화됩니다.
        </div>

        <div className="flex flex-col space-y-4 items-center">
          <ButtonComponent 
            label="화상면접 시작하기" 
            icon="video" 
            onClick={() => startInterview("video")}
            additionalClasses="bg-teal-500 text-white hover:bg-teal-600"
            disabled={cameraStatus === "불량" || micStatus === "불량"}
          />

          <ButtonComponent 
            label="음성면접 시작하기" 
            icon="microphone" 
            onClick={() => startInterview("audio")}
            additionalClasses="bg-teal-500 text-white hover:bg-teal-600"
            disabled={micStatus === "불량"}
          />

          <ButtonComponent 
            label="텍스트 면접 시작하기" 
            icon="keyboard" 
            onClick={() => startInterview("text")}
            additionalClasses="bg-teal-500 text-white hover:bg-teal-600"
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupPage;
