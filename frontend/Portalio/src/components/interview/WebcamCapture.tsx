// src/components/ai/WebcamCapture.tsx
import React, { useRef, useEffect, useState } from 'react';
import { WebcamCaptureProps } from '../../type/InterviewType'; // 외부에서 WebcamCaptureProps를 임포트
import { uploadVideoApi } from '../../api/InterviewAPI';

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ isRecording, interviewType, interviewId, questionId, onUploadComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null); // HTMLVideoElement 타입 설정
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // MediaRecorder 타입 설정
  const chunks = useRef<Blob[]>([]); // Blob 배열로 설정
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (interviewType === "video") {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => console.error("Error accessing media devices.", error));
    }
  }, [interviewType]);

  useEffect(() => {
    if (isRecording && !isUploading) {
      startRecording();
    } else if (!isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      stopRecording();
    }
  }, [isRecording, questionId]);

  const startRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      setIsUploading(true);
      await uploadVideo(blob, interviewId, questionId, 3);
      setIsUploading(false);
    };

  mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadVideo = async (blob: Blob, interviewId: number, questionId: number, retries: number) => {
    const result = await uploadVideoApi(interviewId, questionId, blob, retries);
    onUploadComplete(result);
  };

  return (
    <div className="w-full h-full">
      {interviewType === "video" ? (
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
      ) : (
        <img
          src="/path/to/default_img.png" // 기본 이미지 경로 수정 필요
          alt="기본 이미지"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default WebcamCapture;
