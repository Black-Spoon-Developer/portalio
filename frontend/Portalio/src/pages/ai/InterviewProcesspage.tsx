import React, { useEffect, useCallback, useState } from "react";
import WebcamCapture from "../../components/ai/WebcamCapture";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { interviewActions } from "../../store/interview/InterviewSlice";
import QuestionTimer from "../../components/ai/QuestionTimer";
import { useNavigate, useLocation } from "react-router-dom";
import { uploadVideoApi } from "../../api/InterviewAPI";

const InterviewProcessPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { interviewId, questions, currentQuestionIndex, isPreparationTime, isFinished, isRecording, pendingUploads } = useSelector(
    (state: RootState) => state.interview
  );

  const interviewType = location.state?.interviewType || "video";
  const [isLastUploadInProgress, setIsLastUploadInProgress] = useState(false); // 업로드 상태 관리

  // 면접이 시작될 때 준비 상태로 설정
  useEffect(() => {
    if (isFinished) {
      dispatch(interviewActions.resetInterview()); // 면접 상태 초기화
    } else if (questions.length > 0 && currentQuestionIndex === 0) {
      dispatch(interviewActions.startPreparation()); // 첫 질문에서 준비 상태로 설정
    }
  }, [dispatch, questions.length, isFinished, currentQuestionIndex]);

  useEffect(() => {
    console.log("Updated pendingUploads state:", pendingUploads);
  }, [pendingUploads]);

  // 준비시간이 끝나면 답변시간 시작
  const handlePreparationEnd = useCallback(() => {
    dispatch(interviewActions.startAnswering());
  }, [dispatch]);

  // 녹화가 완료되었을 때 비디오 업로드를 비동기적으로 수행
  const handleRecordingComplete = useCallback(
    async (blob: Blob) => {
      const questionId = currentQuestionIndex;
      console.log("Adding to pendingUploads:", questionId);
      dispatch(interviewActions.addPendingUpload(questionId));

      // 마지막 질문 업로드 상태 설정
      if (questionId === questions.length - 1) {
        setIsLastUploadInProgress(true);
      }

      try {
        if (interviewId !== null) {
          const result = await uploadVideoApi(interviewId, questionId, blob);
          if (result) {
            dispatch(interviewActions.saveAnalysisResult({ questionId, result }));
          }
        }
      } catch (error) {
        console.error("Failed to upload video:", error);
      } finally {
        dispatch(interviewActions.removePendingUpload(questionId));
        
        // 마지막 질문 업로드가 완료되면 로딩 상태를 해제하고 분석 페이지로 이동
        if (questionId === questions.length - 1) {
          setIsLastUploadInProgress(false);
          navigate("/ai/analyze/1/");
        }
      }
    },
    [currentQuestionIndex, dispatch, interviewId, navigate, questions.length]
  );

  // 답변 시간이 끝나면 녹화를 종료하고 다음 질문으로 이동
  const handleAnswerEnd = useCallback(() => {
    dispatch(interviewActions.stopAnswering());

    if (currentQuestionIndex < questions.length - 1) {
      dispatch(interviewActions.incrementQuestionIndex());
      dispatch(interviewActions.startPreparation());
    }
  }, [currentQuestionIndex, dispatch, questions.length]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-12 text-center">
        {/* Step 표시 */}
        <div className="flex justify-evenly mb-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center font-bold text-white rounded transform rotate-45 ${
                index <= currentQuestionIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span className="transform -rotate-45">{index + 1}</span>
            </div>
          ))}
        </div>
      </header>

      <section className="flex justify-center items-start space-x-16">
        {/* 인터뷰 타입에 따라 다른 화면 표시 */}
        <div className="w-1/2 max-w-lg bg-white rounded-lg shadow-md p-4 relative">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-gray-200 text-gray-800 font-bold text-center rounded-lg px-4 py-2">
              {interviewType === "video" ? "화상 면접" : interviewType === "audio" ? "음성 면접" : "텍스트 면접"}
            </span>
            <QuestionTimer
              isPreparationTime={isPreparationTime}
              preparationTime={30}
              answerTime={60}
              onPreparationEnd={handlePreparationEnd}
              onAnswerEnd={handleAnswerEnd}
            />
          </div>

          {/* 면접 화면 표시 */}
          <div className="bg-gray-200 w-full mb-4 rounded-lg flex items-center justify-center overflow-hidden">
            {interviewType === "video" && (
              <WebcamCapture isRecording={isRecording} onRecordingComplete={handleRecordingComplete} />
            )}
            {interviewType === "audio" && <img src="/path/to/default-image.png" alt="음성 면접 이미지" />}
            {interviewType === "text" && (
              <p className="text-gray-500">텍스트 면접에서는 질문에 텍스트로 답변하세요.</p>
            )}
          </div>
        </div>

        {/* 질문 및 답변 버튼 영역 */}
        <div className="w-1/3 flex flex-col relative" style={{ height: "448px" }}>
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {`질문 ${currentQuestionIndex + 1}`}
            </h2>
            <p className="text-2xl font-bold text-gray-800">{questions[currentQuestionIndex]}</p>
          </section>

          <button
            onClick={isPreparationTime ? handlePreparationEnd : handleAnswerEnd}
            className={`w-full py-3 text-white rounded-lg text-lg absolute bottom-0 transition ${
              isPreparationTime ? "bg-teal-500 hover:bg-teal-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPreparationTime ? "답변하기" : "답변 완료"}
          </button>
        </div>
      </section>

      {/* 마지막 질문 업로드 중일 때 로딩 메시지 표시 */}
      {isLastUploadInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <p className="text-white text-2xl">로딩중...</p>
        </div>
      )}
    </div>
  );
};

export default InterviewProcessPage;
