// src/components/ai/WebcamCapture.tsx
import React, { useRef, useEffect, useState } from 'react';
import { WebcamCaptureProps } from '../../type/InterviewType';

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ isRecording, onRecordingComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isStreamReady, setIsStreamReady] = useState(false);  // 스트림 준비 상태 추가

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamReady(true);  // 스트림이 준비되었음을 표시
        }
      })
      .catch(error => console.error("Error accessing media devices.", error));
  }, []);

  useEffect(() => {
    if (isRecording && isStreamReady) {
      startRecording();
      console.log("녹화시작");
    } else if (!isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      stopRecording();
      console.log("녹화끝");
    }
  }, [isRecording, isStreamReady]);

  const startRecording = () => {
    const stream = videoRef.current?.srcObject;
    if (stream instanceof MediaStream) {  // stream이 MediaStream인지 확인
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {  // onstop 핸들러는 start에서 정의
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        if (onRecordingComplete) {
          onRecordingComplete(blob);  // 녹화 완료 시 상위 컴포넌트로 blob 전달
        }
      };

      mediaRecorderRef.current.start();
    } else {
      console.error("MediaRecorder could not start because stream is not of type MediaStream.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return <video ref={videoRef} autoPlay muted />;
};

export default WebcamCapture;
