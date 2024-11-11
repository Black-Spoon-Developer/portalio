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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 relative">
        <h1 className="text-2xl font-bold mb-4 text-center">AI 모의 면접을 준비해주세요</h1>

        {/* 도움말 아이콘 */}
        <div className="absolute top-4 right-4">
          <i className="fas fa-question-circle text-blue-500 text-2xl"></i>
        </div>

        {/* 상단 상태 표시 */}
        <div className="flex justify-center items-center space-x-8 text-lg mb-6">
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

        {/* 화상 화면과 버튼 영역 */}
        <div className="flex justify-between items-start space-x-8">
          {/* 중앙 화상 화면 */}
          <div className="w-[480px] h-[380px] bg-gray-200 rounded-lg overflow-hidden">
            
              <CameraPreview cameraStatus={cameraStatus}/>
            
          </div>

          {/* 오른쪽 버튼 영역 */}
          <div className="w-1/3 flex flex-col space-y-4">
            <p className="text-sm text-gray-500 mb-4 text-center">질문 생성이 완료되면 시작 버튼이 활성화됩니다.</p>

            <ButtonComponent 
              label="화상면접 시작하기" 
              icon="video" 
              onClick={() => startInterview("video")}
              additionalClasses="bg-teal-400 text-white hover:bg-teal-500 w-full h-[50px] text-lg rounded-lg flex items-center justify-center space-x-2 shadow"
              disabled={cameraStatus === "불량" || micStatus === "불량"}
            />

            <ButtonComponent 
              label="음성면접 시작하기" 
              icon="microphone" 
              onClick={() => startInterview("audio")}
              additionalClasses="bg-teal-400 text-white hover:bg-teal-500 w-full h-[50px] text-lg rounded-lg flex items-center justify-center space-x-2 shadow"
              disabled={micStatus === "불량"}
            />

            <ButtonComponent 
              label="텍스트 면접 시작하기" 
              icon="keyboard" 
              onClick={() => startInterview("text")}
              additionalClasses="bg-teal-400 text-white hover:bg-teal-500 w-full h-[50px] text-lg rounded-lg flex items-center justify-center space-x-2 shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
};



export default InterviewSetupPage;
