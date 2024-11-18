import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { QuestionDTO } from "../../../../interface/aiInterview/AICommonInterface";
import { InterviewActions } from "../../../../store/aiInterview/InterviewSlice";
import { submitAudioAnswer } from "../../../../api/AudioInterviewAPI";
import { AudioAnswerRequest } from "../../../../interface/aiInterview/AudioInterviewInterface";
import LoadingSpinner from "../../../../components/spinner/LoadingSpinner";

const AudioProcessPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // audioURL 관련 상태
  const [_, setAudioUrl] = useState("");

  // 지금 답변하려는 질문 출력을 위한 상태
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDTO>();

  // 레코더 참조
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // 중앙 저장소에서 필요한 상태들을 가져오기
  // 생성된 질문들, 녹음 중 상태, audio URL - useState에서 해결?, / question ID, interviewID - 요청 보낼때 필요함, portfoilId - optional, repositoryId - optional, currentIndex 현재 질문 인덱스
  const {
    questions,
    isRecording,
    questionId,
    interviewId,
    portfolioId,
    repositoryId,
    currentIndex,
  } = useSelector((state: RootState) => state.aiInterview);
  const [recordingTime, setRecordingTime] = useState(0); // 녹음 시간 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 추가
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // 타이머 참조

  const startTimer = async () => {
    dispatch(InterviewActions.startIsRecording());

    // 타이머 시작
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    // 녹음 로직 시작
    console.log("녹음 시작");
  };

  const stopTimer = async () => {
    dispatch(InterviewActions.endIsRecording());

    // 타이머 정지
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 녹음 로직 종료
    console.log("녹음 종료");
  };

  // 녹음 시간 포맷 변환 함수 (초 -> MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // 녹음 시작 함수
  const startRecording = async () => {
    try {
      // 여기서 녹음 중이라는 상태로 바꾸고 타이머 및 로직 시작
      startTimer();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      console.log("녹음 시작");
    } catch (err) {
      alert("마이크 접근 권한이 필요합니다." + err);
      console.error("Error accessing microphone:", err);
    }
  };

  // 녹음 중지
  const stopRecording = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject("MediaRecorder is not initialized.");
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        resolve(audioUrl); // URL 반환
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      dispatch(InterviewActions.endIsRecording());
    });
  };

  // 답변 제출 핸들러 함수
  const handleAnswerSubmit = async () => {
    try {
      stopTimer();
      const audioUrl = await stopRecording(); // URL 가져오기
      console.log(audioUrl);

      if (!audioUrl) {
        alert("녹음된 오디오가 없습니다.");
        return;
      }

      // 만약 마지막 질문이 아니면 다음 질문을 가져와서 세팅하기
      if (currentIndex < 4) {
        // 오디오 Blob 가져오기
        const audioBlob = await fetch(audioUrl).then((r) => r.blob());

        // FormData 준비
        const formData = new FormData();
        const requestData: AudioAnswerRequest = {
          question_id: Number(questionId),
          interview_id: Number(interviewId),
          ...(portfolioId && { portfolio_id: Number(portfolioId) }),
          ...(repositoryId && { repository_id: Number(repositoryId) }),
        };

        formData.append("audio_file", audioBlob, "recording.wav");
        formData.append("request", JSON.stringify(requestData));

        // 음성 답변 제출 요청 - 비동기
        submitAudioAnswer(formData);

        // 타이머 초기화
        setRecordingTime(0);

        const nextIndex = currentIndex + 1;
        setCurrentQuestion(questions[nextIndex]); // 바로 다음 질문 설정
        dispatch(InterviewActions.incrementCurrentIndex());
        dispatch(
          InterviewActions.setQuestionId(questions[nextIndex].question_id)
        );
      } else {
        // 마지막 답변 제출 시 제출 중이라는 로딩 스피너 출력
        setIsSubmitting(true);

        // 마지막 제출 요청을 다 보낸후 답변 분석 요청을 가져온 다음
        // 오디오 Blob 가져오기
        const audioBlob = await fetch(audioUrl).then((r) => r.blob());

        // FormData 준비
        const formData = new FormData();
        const requestData: AudioAnswerRequest = {
          question_id: Number(questionId),
          interview_id: Number(interviewId),
          ...(portfolioId && { portfolio_id: Number(portfolioId) }),
          ...(repositoryId && { repository_id: Number(repositoryId) }),
        };

        formData.append("audio_file", audioBlob, "recording.wav");
        formData.append("request", JSON.stringify(requestData));

        // 음성 답변 제출 요청
        await submitAudioAnswer(formData);

        // 로딩 멈추기
        setIsSubmitting(false);

        // 분석 페이지로 이동
        navigate(`/ai/interview/audio/analysis/${interviewId}`);
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("Error:", err);
    }
  };

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
    <div className="grid grid-cols-6 h-screen">
      <section className="col-span-1"></section>
      {/* 메인 컨텐츠 */}
      <section className="col-span-4 flex justify-center items-center border-2 my-auto p-10 rounded-lg h-5/6 shadow-sm">
        <section className="grid grid-cols-2 w-full h-2/3">
          {/* 왼쪽에 음성 녹음이 시작되는 화면 띄우기 */}
          <div className="col-span-1 flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 shadow-md">
            {isRecording ? (
              <>
                {/* 녹음 중 UI */}
                <div className="mb-4 flex items-center">
                  <div className="animate-pulse bg-red-500 w-4 h-4 rounded-full mr-2"></div>
                  <span className="text-lg font-semibold text-gray-700">
                    녹음 중...
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-red-500 animate-pulse"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2zm-7 9a7 7 0 0114 0H3zm9 3.93A5.978 5.978 0 0010 15a5.978 5.978 0 00-2 .93V17h4v-1.07z" />
                    </svg>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* 녹음 시작 전 UI */}
                <div className="text-gray-600 text-sm flex flex-col items-center justify-center h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm10 12H5V5h10v10z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="font-semibold text-lg">녹음 준비 완료</p>
                </div>
              </>
            )}
          </div>
          {/* 오른쪽에는 질문 및 답변 시작하기 버튼 */}
          <section className="col-span-1 flex flex-col justify-around ml-10">
            <div className="text-2xl font-bold">{emoji} 질문</div>
            <div>{currentQuestion?.question_text}</div>
            {/* 녹음 버튼 - 시작 종료 2개를 만들어서 isRecording 상태에 따라서 다르게 보여주기 */}
            {isRecording ? (
              <button
                onClick={handleAnswerSubmit}
                className="p-3 w-full bg-conceptSkyBlue rounded-3xl font-bold text-white hover:bg-hoverConceptSkyBlue"
              >
                녹음 종료
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-3 w-full bg-conceptSkyBlue rounded-3xl font-bold text-white hover:bg-hoverConceptSkyBlue"
              >
                녹음 시작
              </button>
            )}
          </section>
        </section>
      </section>
      <section className="col-span-1"></section>
    </div>
  );
};

export default AudioProcessPage;
