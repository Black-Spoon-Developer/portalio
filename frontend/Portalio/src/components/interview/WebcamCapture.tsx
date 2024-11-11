// src/components/WebcamCapture.tsx
import React, { useRef, useEffect, useState } from 'react';
import { WebcamCaptureProps } from '../../type/InterviewType'; // 타입을 import


const WebcamCapture: React.FC<WebcamCaptureProps> = ({ isRecording, questionId, onUploadComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(error => console.error("Error accessing media devices.", error));
  }, []);

  useEffect(() => {
    console.log(`WebcamCapture useEffect triggered - isRecording: ${isRecording}, questionId: ${questionId}`);
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
      console.log("Recording stopped, starting upload...");
      setIsUploading(true);
      await uploadVideo(blob, 3);  // 재시도 횟수를 3으로 설정
      setIsUploading(false);
    };

    mediaRecorderRef.current.start();
    console.log(`Starting recording for question ${questionId}`);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      console.log(`Stopping media recorder for question ${questionId}`);
    } else {
      console.log("Media recorder is inactive or not defined");
    }
  };

  const uploadVideo = async (blob: Blob, retries: number) => {
    const formData = new FormData();
    formData.append('file', blob, `question_${questionId}.webm`);

    try {
      console.log(`Uploading video for question ${questionId}`);
      const response = await fetch(`http://localhost:8000/upload-video/1/${questionId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log("Upload result:", result);
      onUploadComplete(result.analysis_result);

    } catch (error) {
      console.error(`Error uploading video for question ${questionId}:`, error);
      if (retries > 0) {
        console.log(`Retrying upload for question ${questionId}. Retries left: ${retries - 1}`);
        setTimeout(() => uploadVideo(blob, retries - 1), 1000); // 1초 후 재시도
      } else {
        console.error(`Failed to upload video for question ${questionId} after multiple attempts.`);
      }
    }
  };

  return <video ref={videoRef} autoPlay muted />;
};

export default WebcamCapture;