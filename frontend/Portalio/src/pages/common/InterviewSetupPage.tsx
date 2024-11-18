// src/pages/interview/InterviewSetupPage.tsx
import React, { useState, useEffect } from "react";
import CameraPreview from "../../components/ai/aiSetup/CameraSetup";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../components/ai/button/InterviewProcessBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMicrophone,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";

const InterviewSetupPage: React.FC = () => {
  const [cameraStatus, setCameraStatus] = useState<"양호" | "불량">("불량");
  const [micStatus, setMicStatus] = useState<"양호" | "불량">("불량");
  const navigate = useNavigate();

  // 카메라와 마이크 상태 확인
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraStatus("양호"))
      .catch(() => setCameraStatus("불량"));

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setMicStatus("양호"))
      .catch(() => setMicStatus("불량"));
  }, []);

  const startInterview = (type: "video" | "audio" | "text") => {
    // 중앙 저장소에 타입을 저장
    if (type === "text") {
      navigate("/ai/interview/text/process");
    } else if (type === "audio") {
      navigate("/ai/interview/audio/process");
    } else {
      navigate("/ai/interview/video/process");
    }
  };

  // 버튼 활성화 여부 설정
  const isVideoEnabled = cameraStatus === "양호" && micStatus === "양호";
  const isAudioEnabled = cameraStatus === "양호" || micStatus === "양호";
  const isTextEnabled = true; // 텍스트 면접은 항상 활성화

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl min-h-[600px] bg-white rounded-lg shadow-md p-8 relative flex flex-col justify-between">
        <h1 className="text-3xl font-bold mt-4 text-center">
          AI 모의 면접을 준비해주세요
        </h1>

        <div className="absolute top-4 right-4">
          <i className="fas fa-question-circle text-blue-500 text-2xl"></i>
        </div>

        <div className="flex flex-row items-end justify-center space-x-8 mb-8">
          <div className="flex-shrink-0 w-[500px] h-[380px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <CameraPreview cameraStatus={cameraStatus} />
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            {/* 상태 표시에 아이콘 추가 */}
            <div className="flex flex-col items-center justify-center mb-5 text-lg h-[60px]">
              <div className="flex items-center space-x-4 mb-6">
                <FontAwesomeIcon icon={faVideo} className="text-gray-700" />
                <span
                  className={
                    cameraStatus === "양호" ? "text-blue-500" : "text-red-500"
                  }
                >
                  카메라 {cameraStatus}
                </span>
              </div>
              <div className="flex items-center space-x-4 ">
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className="text-gray-700"
                />
                <span
                  className={
                    micStatus === "양호" ? "text-blue-500" : "text-red-500"
                  }
                >
                  마이크 {micStatus}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              질문 생성이 완료되면 시작 버튼이 활성화됩니다.
            </p>

            {/* 화상 면접 버튼 */}
            <ButtonComponent
              label="화상면접 시작하기"
              icon={faVideo}
              onClick={() => startInterview("video")}
              additionalClasses="bg-teal-400 text-white hover:bg-teal-500 w-full h-[70px] text-lg rounded-lg flex items-center justify-center space-x-2 shadow"
              disabled={!isVideoEnabled}
            />

            {/* 음성 면접 버튼 */}
            <ButtonComponent
              label="음성면접 시작하기"
              icon={faMicrophone}
              onClick={() => startInterview("audio")}
              additionalClasses="bg-teal-400 text-white hover:bg-teal-500 w-full h-[70px] text-lg rounded-lg flex items-center justify-center space-x-2 shadow"
              disabled={!isAudioEnabled}
            />

            {/* 텍스트 면접 버튼 */}
            <ButtonComponent
              label="텍스트 면접 시작하기"
              icon={faKeyboard}
              onClick={() => startInterview("text")}
              additionalClasses="bg-teal-400 text-white hover:bg-teal-500 w-full h-[70px] text-lg rounded-lg flex items-center justify-center space-x-2 shadow"
              disabled={!isTextEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupPage;
