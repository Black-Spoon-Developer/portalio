import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { InterviewActions } from "../../../../store/aiInterview/InterviewSlice";
import { QuestionDTO } from "../../../../interface/aiInterview/AICommonInterface";
import { submitVideoAnswer } from "../../../../api/VideoInterviewAPI";
import { VideoAnswerRequest } from "../../../../interface/aiInterview/VideoInterviewInterface";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";

const VideoProcessPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 중앙 저장소에서 필요한 상태들을 가져오기
  // 생성된 질문들, 녹화,녹음중 상태, question ID랑 interviewID는 요청보낼때 필요하고  portfolioId 랑 repositoryId 는 옵션, currentIndex는 질문 인덱스
  const {
    questions,
    isRecording,
    questionId,
    interviewId,
    portfolioId,
    repositoryId,
    currentIndex,
  } = useSelector((state: RootState) => state.aiInterview);

  //chunk 관련
  // const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  // const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // 지금 답변하려는 질문 출력을 위한 상태
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDTO>();

  // 제출 로딩 스피너를 위한 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [videoUrl, setVideoUrl] = useState("");

  // // audioUrl 관련 상태
  // const [audioUrl, setAudioUrl] = useState("");

  // useRef의 초기값과 타입 명시, 레코더, 비디오, 오디오, 스트림 참조
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // MediaStream 타입 명시

  // chunkRef
  const videoChunksRef = useRef<Blob[]>([]);
  const audioChunkRef = useRef<Blob[]>([]);

  // 녹화 및 녹음 시작 함수
  const startRecording = async () => {
    try {
      // 비디오 오디오 사용
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
        mimeType: "video/mp4",
      });
      mediaRecorderRef.current = mediaRecorder;

      // 오디오 레코더 설정
      // 필요 없음
      const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
      // 필요 있음
      const audioRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });
      audioRecorderRef.current = audioRecorder;

      // 데이터 수집 - 잘됨
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // setRecordedChunks((prev) => [...prev, event.data]);
          videoChunksRef.current.push(event.data);
        } else {
          console.error("No video data available in chunk.");
        }
      };

      audioRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // setAudioChunks((prev) => [...prev, event.data]);
          audioChunkRef.current.push(event.data);
        } else {
          console.error("No audio data available in chunk.");
        }
      };

      mediaRecorder.start();
      audioRecorder.start();

      dispatch(InterviewActions.startIsRecording());
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  //녹화 및 녹음을 멈췄을 때
  const stopRecording = async (): Promise<{
    videoUrl: string;
    audioUrl: string;
  }> => {
    return new Promise((resolve, reject) => {
      const urls: { videoUrl?: string; audioUrl?: string } = {};
      let stopCount = 0; // 두 녹음기가 멈췄는지 확인하는 카운터

      const checkAndResolve = () => {
        stopCount++;
        if (stopCount === 2) {
          if (urls.videoUrl && urls.audioUrl) {
            resolve(urls as { videoUrl: string; audioUrl: string });
          } else {
            reject(new Error("Failed to generate video or audio URL"));
          }
        }
      };

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          const videoBlob = new Blob(videoChunksRef.current, {
            type: "video/mp4",
          });
          const videoUrl = URL.createObjectURL(videoBlob);
          urls.videoUrl = videoUrl;

          videoChunksRef.current = [];

          checkAndResolve();
        };
        mediaRecorderRef.current.stop();
      } else {
        checkAndResolve();
      }

      if (audioRecorderRef.current) {
        audioRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunkRef.current, {
            type: "audio/webm",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          urls.audioUrl = audioUrl;

          audioChunkRef.current = [];

          checkAndResolve();
        };
        audioRecorderRef.current.stop();
      } else {
        checkAndResolve();
      }

      // Stream 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      dispatch(InterviewActions.endIsRecording());
    });
  };

  // 답변 제출 -> 마지막 질문이 아니면 다음 질문 가져오기, 마지막 제출 요청을 다보내면 분석페이지로가기
  const handleAnswerSubmit = async () => {
    try {
      // 답변 중지
      const { videoUrl, audioUrl } = await stopRecording();

      // 만약 마지막 질문이 아니면 다음 질문을 가져와서 세팅하기
      if (currentIndex < 4) {
        // 서버에 보내기 위한 formData 정의
        // 비디오와 오디오 Blob 생성
        const audioBlob = await fetch(audioUrl).then((r) => r.blob());
        const videoBlob = await fetch(videoUrl).then((r) => r.blob());

        // FormData 구성
        const formData = new FormData();
        const requestData: VideoAnswerRequest = {
          question_id: Number(questionId),
          interview_id: Number(interviewId),
          ...(portfolioId && { portfolio_id: Number(portfolioId) }),
          ...(repositoryId && { repository_id: Number(repositoryId) }),
        };

        formData.append("video_file", videoBlob, "recording.mp4");
        formData.append("audio_file", audioBlob, "recording.webm");
        formData.append("request", JSON.stringify(requestData));

        submitVideoAnswer(formData);

        // Chunk 데이터 초기화
        videoChunksRef.current = [];
        audioChunkRef.current = [];

        // 다음 질문으로 넘어가기 처리
        const nextIndex = currentIndex + 1;
        setCurrentQuestion(questions[nextIndex]); // 바로 다음 질문 설정
        dispatch(InterviewActions.incrementCurrentIndex());
        dispatch(
          InterviewActions.setQuestionId(questions[nextIndex].question_id)
        );
      } else {
        // 서버에 보내기 위한 formData 정의
        // 비디오와 오디오 Blob 생성
        const audioBlob = await fetch(audioUrl).then((r) => r.blob());
        const videoBlob = await fetch(videoUrl).then((r) => r.blob());

        // FormData 구성
        console.log(questionId);
        const formData = new FormData();
        const requestData: VideoAnswerRequest = {
          question_id: Number(questionId),
          interview_id: Number(interviewId),
          ...(portfolioId && { portfolio_id: Number(portfolioId) }),
          ...(repositoryId && { repository_id: Number(repositoryId) }),
        };

        formData.append("video_file", videoBlob, "recording.mp4");
        formData.append("audio_file", audioBlob, "recording.webm");
        formData.append("request", JSON.stringify(requestData));

        // 로딩 시작
        setIsSubmitting(true);
        await submitVideoAnswer(formData);
        // 로딩 종료
        setIsSubmitting(false);

        // **마이크와 비디오 정리**
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null; // 스트림을 null로 설정하여 참조 제거
        }

        // 라우터로 분석 페이지 이동
        navigate(`/ai/interview/video/analysis/${interviewId}`);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
      console.error("Error:", error);
    }
  };

  // 페이지에 들어오면
  useEffect(() => {
    if (questions && questions.length > 0 && questions[currentIndex]) {
      setCurrentQuestion(questions[currentIndex]); // 현재 질문 업데이트
      dispatch(
        InterviewActions.setQuestionId(questions[currentIndex].question_id)
      ); // 첫번째 질문 ID 설정
    }
  }, []);

  // 몇 번 질문인지에 따라서 나타내는 번호 이모지
  const getEmojiById = (id: number): string => {
    switch (id) {
      case 1:
        return "1️⃣";
      case 2:
        return "2️⃣";
      case 3:
        return "3️⃣";
      case 4:
        return "4️⃣";
      case 5:
        return "5️⃣";
      default:
        return "❓"; // 기본값 (알 수 없는 번호)
    }
  };

  // 번호 이모지 함수
  const emoji = getEmojiById(currentIndex + 1);

  if (isSubmitting) {
    return <LoadingSpinner mode="Submitting" />;
  }

  return (
    <>
      <div className="grid grid-cols-6 h-screen">
        <section className="col-span-1"></section>
        {/* 메인 컨텐츠 */}
        <section className="col-span-4 flex justify-center items-center border-2 my-auto p-10 rounded-lg h-5/6 shadow-sm">
          <section className="grid grid-cols-2 w-full h-2/3">
            {/* 왼쪽에 면접 화면 출력 */}
            <section className="col-span-1 flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 shadow-md">
              {/* 실시간 스트림 표시 */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </section>
            {/* 오른쪽에 질문 및 버튼 */}
            <section className="col-span-1 flex flex-col justify-around ml-10">
              <div className="text-2xl font-bold">{emoji} 질문</div>
              <div>{currentQuestion?.question_text}</div>
              {/* 녹화 버튼 - 시작 버튼 종료 버튼 2개를 만들어서 isRecording 상태에 따라서 다르게 보여주기 */}
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="p-3 w-full bg-conceptSkyBlue rounded-3xl font-bold text-white hover:bg-hoverConceptSkyBlue"
                >
                  답변 시작
                </button>
              ) : (
                <button
                  onClick={handleAnswerSubmit}
                  className="p-3 w-full bg-conceptSkyBlue rounded-3xl font-bold text-white hover:bg-hoverConceptSkyBlue"
                >
                  답변 종료
                </button>
              )}
            </section>
          </section>
        </section>
        <section className="col-span-1"></section>
      </div>
    </>
  );
};

export default VideoProcessPage;
