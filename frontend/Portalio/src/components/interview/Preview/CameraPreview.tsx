// src/components/ai/CameraPreview.tsx
import React, { useRef, useEffect } from "react";

const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // 웹캠 스트림을 가져와서 video 요소에 연결
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // 컴포넌트 언마운트 시 웹캠 스트림을 중지
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
    />

  );
};

export default CameraPreview;
