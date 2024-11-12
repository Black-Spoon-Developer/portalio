import React, { useRef, useEffect } from "react";

interface CameraPreviewProps {
  cameraStatus: "양호" | "불량";
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ cameraStatus }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (cameraStatus === "양호") {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream)
            .getTracks()
            .forEach((track) => track.stop());
        }
      };
    }
  }, [cameraStatus]);

  return (
    <div className="w-full h-full">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className="w-full h-full rounded-lg border border-gray-300" 
        style={{ display: cameraStatus === "양호" ? "block" : "none" }}
      />
      {cameraStatus === "불량" && <div className="text-red-500">카메라를 사용할 수 없습니다.</div>}
    </div>
  );
};

export default CameraPreview;
