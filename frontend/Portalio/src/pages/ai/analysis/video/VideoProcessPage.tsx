import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { InterviewActions } from "../../../../store/aiInterview/InterviewSlice";
import { QuestionDTO } from "../../../../interface/aiInterview/AICommonInterface";
import { submitVideoAnswer } from "../../../../api/VideoInterviewAPI";
import { VideoAnswerRequest } from "../../../../interface/aiInterview/VideoInterviewInterface";
import { useNavigate } from "react-router-dom";

const VideoProcessPage:React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 중앙 저장소에서 필요한 상태들을 가져오기
  // 생성된 질문들, 녹화,녹음중 상태, question ID랑 interviewID는 요청보낼때 필요하고  portfolioId 랑 repositoryId 는 옵션, currentIndex는 질문 인덱스
  const {questions, isRecording, questionId, interviewId, portfolioId, repositoryId, currentIndex } = useSelector((state:RootState) => state.aiInterview)

  //chunk 관련
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // useRef의 초기값과 타입 명시, 레코더, 비디오, 오디오, 스트림 참조
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // MediaStream 타입 명시

  // 녹화 및 녹음 시작 함수
  const startRecording = async () => {
    try {
      // 여기서 녹화 관련 상태를 초기화 하고 시작
      // 타이머도 있으면 여기에 하기
      setRecordedChunks([]);
      setAudioChunks([]);

      // 비디오 및 오디오 스트림 요청
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream; // 스트림 저장
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 비디오 레코더 설정
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      // 오디오 레코더 설정
      const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
      const audioRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });

      // 비디오 데이터 수집
      const videoChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.push(event.data);
        }
      };

      // 오디오 데이터 수집
      const audioChunks: Blob[] = [];
      audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: "video/webm" });
        setRecordedChunks(videoChunks);

      };

      audioRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioChunks(audioChunks);

      };

      mediaRecorderRef.current = mediaRecorder;
      audioRecorderRef.current = audioRecorder;

      mediaRecorder.start();
      audioRecorder.start();

      dispatch(InterviewActions.startIsRecording());

    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  // 녹화 및 녹음을 멈췄을 때
  const stopRecording = () => {

    // mediaRecorder 중지를 통한 비디오 및 오디오 중지
    if (mediaRecorderRef.current && audioRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      audioRecorderRef.current.stop();
      audioRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    // 비디오 및 오디오를 통합한 mediastream 트랙 중지
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }



    dispatch(InterviewActions.endIsRecording());
  };

  // 답변 제출 -> 마지막 질문이 아니면 다음 질문 가져오기, 마지막 제출 요청을 다보내면 분석페이지로가기
  const handleAnswerSubmit = async () => {
    try {
      // 만약 마지막 질문이 아니면 다음 질문을 가져와서 세팅하기
      if(currentIndex < 4) {
      // 서버에 보내기 위한 formData 정의
      const formData = new FormData();

      // requestData 생성
      const requestData:VideoAnswerRequest = {
        question_id:Number(questionId),
        interview_id:Number(interviewId),
        ...(portfolioId && { portfolio_id:Number(portfolioId)}),
        ...(repositoryId && {repository_id:Number(repositoryId)})
      };

      // 비디오 Blob 추가
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      formData.append("video_file", videoBlob, "recording.mp4");

      // 오디오 Blob 추가
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      formData.append("audio_file", audioBlob, "recording.mp3");

      submitVideoAnswer(formData);

      } else {

        // 서버에 보내기 위한 formData 정의
      const formData = new FormData();

      // requestData 생성
      const requestData:VideoAnswerRequest = {
        question_id:Number(questionId),
        interview_id:Number(interviewId),
        ...(portfolioId && { portfolio_id:Number(portfolioId)}),
        ...(repositoryId && {repository_id:Number(repositoryId)})
      };

      // 비디오 Blob 추가
      const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
      formData.append("video_file", videoBlob, "recording.mp4");

      // 오디오 Blob 추가
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      formData.append("audio_file", audioBlob, "recording.mp3");

      await submitVideoAnswer(formData);

      }

    }

  // // 업로드 함수
  // const handleUpload = async () => {
  //   if (recordedChunks.length === 0 || audioChunks.length === 0) return;

  //   try {
  //     // 폼 데이터
  //     const formData = new FormData();

  //     // requestData
  //     const requestData:VideoAnswerRequest = {
  //       question_id:Number(questionId),
  //       interview_id:Number(interviewId),
  //       ...(portfolioId && { portfolio_id:Number(portfolioId)}),
  //       ...(repositoryId && {repository_id:Number(repositoryId)})
  //     };

  //     // 비디오 Blob 추가
  //     const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
  //     formData.append("video_file", videoBlob, "recording.mp4");

  //     // 오디오 Blob 추가
  //     const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
  //     formData.append("audio_file", audioBlob, "recording.mp3");

  //     await submitVideoAnswer(formData);

  //   }
  // }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Video & Audio Recorder</h1>
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        {/* 실시간 스트림 표시 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-4 justify-center mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Stop Recording
          </button>
        )}

        {/* {recordedChunks.length > 0 && (
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Upload
          </button>
        )} */}
      </div>

      {/* {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )} */}

      {/* {preview && (
        <div className="space-y-4">
          <h3 className="font-medium">Preview:</h3>
          <video src={preview} controls className="w-full rounded mb-2" />
          <audio src={audioPreview} controls className="w-full" />
        </div>
      )} */}
    </div>
  );
}

export default VideoProcessPage;
