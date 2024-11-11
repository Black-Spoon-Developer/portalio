// src/components/ai/WebcamCapture.tsx
import React, { useRef, useEffect, useState } from 'react';
import { WebcamCaptureProps } from '../../type/InterviewType';
import { uploadVideoApi } from '../../api/InterviewAPI'; 


const WebcamCapture: React.FC<WebcamCaptureProps> = ({/*isRecording, interviewId, questionId, onUploadComplete*/ }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  //const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  //const chunks = useRef<Blob[]>([]);
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

  /*useEffect(() => {
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
      await uploadVideo(blob, interviewId, questionId, 3); // interviewId와 questionId 추가
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
  */
  return <video ref={videoRef} autoPlay muted />;
};

export default WebcamCapture;
